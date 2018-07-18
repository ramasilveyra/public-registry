'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _magicString = require('magic-string');

var _magicString2 = _interopRequireDefault(_magicString);

var _makeUndefined = require('./make-undefined');

var _makeUndefined2 = _interopRequireDefault(_makeUndefined);

var _ast = require('../ast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function inlining(props) {
  return {
    Attribute: {
      exit(node) {
        if (!node.identifiers) {
          return;
        }
        const value = new _magicString2.default(node.value);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => (0, _makeUndefined2.default)(node, prop, value));
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
      }
    },
    InterpolationEscaped: {
      exit(node, parent) {
        const value = new _magicString2.default(node.value);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => (0, _makeUndefined2.default)(node, prop, value));
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
      enter(node) {
        const test = new _magicString2.default(node.test);
        const propsToChange = props.filter(prop => prop.value && node.identifiers[prop.name]);
        const propsToNotChange = props.filter(prop => !prop.value && node.identifiers[prop.name]);
        propsToNotChange.forEach(prop => (0, _makeUndefined2.default)(node, prop, test, 'test'));
        propsToChange.forEach(prop => {
          const propIDs = node.identifiers[prop.name];
          const propValue = prop.value.value;
          propIDs.forEach(propID => {
            const newValue = prop.value.expression === false ? `'${propValue}'` : String(propValue);
            test.overwrite(propID.start, propID.end, newValue);
          });
          node.test = test.toString();
        });
      }
    }
  };
} /* eslint-disable no-param-reassign */
exports.default = inlining;
//# sourceMappingURL=create-inlining-visitor.js.map