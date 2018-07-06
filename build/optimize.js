'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _htmlTags = require('html-tags');

var _htmlTags2 = _interopRequireDefault(_htmlTags);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _magicString = require('magic-string');

var _magicString2 = _interopRequireDefault(_magicString);

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _traverser = require('./traverser');

var _traverser2 = _interopRequireDefault(_traverser);

var _ast = require('./ast');

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optimize(ast, table) {
  (0, _traverser2.default)(ast, {
    Element: {
      exit(node) {
        const name = node.tagName;
        const isRC = !_htmlTags2.default.includes(name);
        const tableRC = getTableComponent(name, table);
        if (isRC && tableRC) {
          // Generate collection of props name and value.
          const propsToInline = tableRC.node.props && tableRC.node.props.map(prop => {
            if (prop === 'children' && node.children) {
              return { name: prop, value: node.children };
            }
            return {
              name: prop,
              value: node.attributes.find(attr => attr.name === prop)
            };
          });
          // Clone Mixin.
          const componentNode = _lodash2.default.merge({}, tableRC.node);
          // Convert Element in Mixin.
          Object.assign(node, componentNode);
          delete node.tagName;
          delete node.attributes;
          // Inline props.
          if (propsToInline) {
            inlinepProps(node, propsToInline);
          }
          // Check again if new Mixin has React Components.
          optimize(node, table);
        }
      }
    }
  });
  return ast;
} /* eslint-disable no-param-reassign */
exports.default = optimize;


function getTableComponent(name, table) {
  if (table.components[name]) {
    return table.components[name];
  }
  const tableDep = table.dependencies[name];
  if (tableDep) {
    const component = Object.values(table.components).find(rc => rc.createdFrom === tableDep.path && rc.defaultExport);
    return component;
  }
  return null;
}

function inlinepProps(ast, props) {
  (0, _traverser2.default)(ast, {
    Attribute: {
      exit(node, parent) {
        // 1. Inlining.
        if (!node.identifiers) {
          return;
        }
        const value = new _magicString2.default(node.value);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => makeUndefined(node, prop, value));
        propsToChange.forEach(prop => {
          const propIDs = node.identifiers[prop.name];
          const propValue = prop.value.value;
          const canMakeText = Object.keys(node.identifiers).length === 1 && propIDs.length === 1 && propIDs[0].start === 0 && propIDs[0].end === node.value.length;
          propIDs.forEach(propID => {
            const isText = prop.value.expression === false;
            const content = !canMakeText && isText ? `'${String(propValue)}'` : String(propValue);
            value.overwrite(propID.start, propID.end, content);
            if (canMakeText && isText) {
              // Make attr text;
              node.expression = false;
            }
          });
        });
        node.value = value.toString();
        // 2. Dead code elimination.
        if (node.value === 'undefined') {
          parent.attributes = parent.attributes.filter(attr => attr !== node);
          return;
        }
        if (node.expression) {
          const result = evaluate(node.value);
          const remove = result.confident && [null, undefined].includes(result.value);
          if (remove) {
            parent.attributes = parent.attributes.filter(attr => attr !== node);
            return;
          }
          if (result.confident) {
            node.value = result.value;
            node.expression = false;
          }
        }
      }
    },
    InterpolationEscaped: {
      exit(node, parent) {
        // 1. Inlining.
        const value = new _magicString2.default(node.value);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => makeUndefined(node, prop, value));
        propsToChange.forEach(prop => {
          if (prop.name === 'children') {
            const position = parent.children.findIndex(child => child.value === 'children');
            parent.children = [...parent.children.slice(0, position), ...prop.value, ...parent.children.slice(position + 1)];
            return;
          }
          const propIDs = node.identifiers[prop.name];
          const propValue = prop.value.value;
          const canMakeText = Object.keys(node.identifiers).length === 1 && propIDs.length === 1 && propIDs[0].start === 0 && propIDs[0].end === node.value.length;
          propIDs.forEach(propID => {
            const isText = prop.value.expression === false;
            const content = !canMakeText && isText ? `'${String(propValue)}'` : String(propValue);
            value.overwrite(propID.start, propID.end, content);
            if (canMakeText && isText) {
              // Convert to Text.
              node.type = _ast.textName;
              delete node.identifiers;
            }
          });
          node.value = value.toString();
        });
        // 2. Dead code elimination.
        if (node.value === 'undefined') {
          // HACK: to "remove" InterpolationEscaped.
          node.value = '';
          node.type = _ast.textName;
        }
      }
    },
    Iteration: {
      exit(node) {
        const propToInline = props.find(prop => prop.name === node.iterable);
        if (propToInline && propToInline.value && propToInline.value.expression) {
          node.iterable = propToInline.value.value;
        }
      }
    },
    Condition: {
      enter(node, parent) {
        // 1. Inlining.
        const test = new _magicString2.default(node.test);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => makeUndefined(node, prop, test, 'test'));
        propsToChange.forEach(prop => {
          const propIDs = node.identifiers[prop.name];
          const propValue = prop.value.value;
          if (prop.value.expression === false) {
            node.test = `"${propValue}"`;
            return;
          }
          propIDs.forEach(propID => {
            test.overwrite(propID.start, propID.end, String(propValue));
          });
          node.test = test.toString();
        });
        // 2. Dead code elimination.
        const evaluates = isTruthy(node.test);
        if (evaluates === false) {
          if (parent.type === _ast.conditionName) {
            delete parent.type;
            delete parent.test;
            delete parent.alternate;
            delete parent.consequent;
            delete parent.identifiers;
            Object.assign(parent, node.alternate);
            return;
          }
          parent.children = parent.children.map(child => {
            if (child === node) {
              return node.alternate;
            }
            return child;
          }).filter(Boolean);
          return;
        }
        if (evaluates === true) {
          parent.children = parent.children.map(child => {
            if (child === node) {
              return node.consequent;
            }
            return child;
          }).filter(Boolean);
        }
      }
    }
  });
}

// function makeReferenceSafe(node, prop, magicString, key = 'value') {
//   const propIDs = node.identifiers[prop.name];
//   propIDs.forEach(propID => {
//     const contentVar = magicString.slice(propID.start, propID.end);
//     const content = `(typeof ${contentVar} === 'undefined' ? undefined : ${contentVar})`;
//     magicString.overwrite(propID.start, propID.end, content);
//   });
//   node[key] = magicString.toString();
// }

function makeUndefined(node, prop, magicString, key = 'value') {
  const propIDs = node.identifiers[prop.name];
  propIDs.forEach(propID => {
    const content = 'undefined';
    magicString.overwrite(propID.start, propID.end, content);
  });
  node[key] = magicString.toString();
}

function isTruthy(code) {
  const bodyChild = getBodyChild(code);
  if (!bodyChild) {
    return null;
  }
  const evaluates = bodyChild.evaluateTruthy();
  return evaluates;
}

function evaluate(code) {
  const bodyChild = getBodyChild(code);
  if (!bodyChild) {
    return null;
  }
  const evaluates = bodyChild.evaluate();
  return evaluates;
}

function getBodyChild(code) {
  let bodyChild = null;
  (0, _traverse2.default)((0, _parser2.default)(`(${code})`), {
    Program(path) {
      const body = path.get('body');
      if (!body) {
        return;
      }
      bodyChild = body[0];
    }
  }, null);
  return bodyChild;
}
//# sourceMappingURL=optimize.js.map