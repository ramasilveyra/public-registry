'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _generator = require('@babel/generator');

var _generator2 = _interopRequireDefault(_generator);

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _cleanJSXElementLiteralChild = require('@babel/types/lib/utils/react/cleanJSXElementLiteralChild');

var _cleanJSXElementLiteralChild2 = _interopRequireDefault(_cleanJSXElementLiteralChild);

var _ast = require('./ast');

var _isFunctionalReactComponent = require('./utils/is-functional-react-component');

var _isFunctionalReactComponent2 = _interopRequireDefault(_isFunctionalReactComponent);

var _getReactComponentName = require('./utils/get-react-component-name');

var _getReactComponentName2 = _interopRequireDefault(_getReactComponentName);

var _addToContext = require('./utils/add-to-context');

var _addToContext2 = _interopRequireDefault(_addToContext);

var _getReactComponentProps = require('./utils/get-react-component-props');

var _getReactComponentProps2 = _interopRequireDefault(_getReactComponentProps);

var _inlineStyles = require('./utils/inline-styles');

var _inlineStyles2 = _interopRequireDefault(_inlineStyles);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-underscore-dangle, no-param-reassign */
function transformation(oldAst, inputFilePath) {
  const newAst = (0, _ast.createRoot)();
  const table = { components: {}, dependencies: {} };

  const reactComponentVisitor = {
    JSXElement(path) {
      const tagName = path.node.openingElement.name.name;
      const isFromDependency = table.dependencies[tagName];
      if (isFromDependency) {
        isFromDependency.isUsedAsRC = true;
      }
      const element = (0, _ast.createElement)(tagName);
      const context = getContext(path);
      (0, _addToContext2.default)(context, element);
      setContext(path, element);
    },
    JSXText(path) {
      const elems = [];
      (0, _cleanJSXElementLiteralChild2.default)(path.node, elems);
      const value = elems[0] ? elems[0].value : '';
      if (!value) {
        return;
      }
      const text = (0, _ast.createText)(value);
      const context = getContext(path);
      (0, _addToContext2.default)(context, text);
    },
    JSXExpressionContainer(path) {
      // Let JSXAttribute visitor handle JSXExpressionContainer of attributes.
      if (t.isJSXAttribute(path.parent)) {
        return;
      }

      const expressionPath = path.get('expression');
      const expression = expressionPath.node;

      if (t.isLogicalExpression(expression, { operator: '&&' })) {
        return;
      }
      if (t.isLogicalExpression(expression, { operator: '||' })) {
        return;
      }
      if (t.isConditionalExpression(expression)) {
        return;
      }

      const isIterator = isMapIterator(expression);

      if (isIterator) {
        return;
      }

      const context = getContext(path);
      const identifiers = getIdentifiersInfo(expressionPath);

      if (t.isIdentifier(expression)) {
        const interpolationEscaped = (0, _ast.createInterpolationEscaped)(expression.name, identifiers);
        (0, _addToContext2.default)(context, interpolationEscaped);
        return;
      }
      const { code } = (0, _generator2.default)(expression);
      const interpolationEscaped = (0, _ast.createInterpolationEscaped)(code, identifiers);
      (0, _addToContext2.default)(context, interpolationEscaped);
    },
    JSXAttribute(path) {
      const context = getContext(path);
      const name = path.node.name.name;
      const valueNode = path.node.value;
      if (shouldIgnoreAttr(name)) {
        return;
      }
      if (!valueNode) {
        const attribute = (0, _ast.createAttribute)({ name, value: true, expression: true });
        (0, _addToContext2.default)(context, attribute, 'attributes');
        return;
      }
      if (t.isStringLiteral(valueNode)) {
        const attribute = (0, _ast.createAttribute)({ name, value: valueNode.value });
        (0, _addToContext2.default)(context, attribute, 'attributes');
        return;
      }
      const expression = path.get('value.expression');
      if (t.isJSXExpressionContainer(valueNode) && t.isIdentifier(expression.node)) {
        const identifiers = getIdentifiersInfo(expression);
        const attribute = (0, _ast.createAttribute)({
          name,
          value: expression.node.name,
          expression: true,
          identifiers
        });
        (0, _addToContext2.default)(context, attribute, 'attributes');
        return;
      }
      if (name === 'style') {
        const styles = {};
        expression.node.properties.forEach(prop => {
          styles[prop.key.name] = prop.value.value;
        });
        const stringInlineStyles = (0, _inlineStyles2.default)(styles);
        if (stringInlineStyles) {
          const attribute = (0, _ast.createAttribute)({ name, value: stringInlineStyles });
          (0, _addToContext2.default)(context, attribute, 'attributes');
        }
        return;
      }

      const generated = (0, _generator2.default)(expression.node, { concise: true, sourceMaps: true });
      const identifiers = getIdentifiersInfo(expression);
      const fixedIdentifiers = Object.keys(identifiers).reduce((obj, key) => {
        const keyMappings = generated.rawMappings.filter(keyMapping => keyMapping.name === key);
        obj[key] = identifiers[key].map((indentifier, i) => {
          const start = keyMappings[i].generated.column;
          const end = start + key.length;
          return { start, end };
        });
        return obj;
      }, {});
      const attribute = (0, _ast.createAttribute)({
        name,
        value: generated.code,
        expression: true,
        identifiers: fixedIdentifiers
      });
      (0, _addToContext2.default)(context, attribute, 'attributes');
    },
    CallExpression(path) {
      const callee = path.node.callee;
      const aarguments = path.node.arguments[0];
      const isIterator = isMapIterator(path.node);
      if (isIterator) {
        const context = getContext(path);
        const { code } = (0, _generator2.default)(callee);
        const iterable = code.replace('.map', '');
        const currentValue = aarguments.params[0].name;
        const index = aarguments.params[1] ? aarguments.params[1].name : null;
        const array = aarguments.params[2] ? aarguments.params[2].name : null;
        const iteration = (0, _ast.createIteration)({ iterable, currentValue, index, array });
        (0, _addToContext2.default)(context, iteration);
        setContext(path, iteration);
      }
    },
    LogicalExpression(path) {
      if (t.isConditionalExpression(path.parent) && path.parent.test === path.node) {
        return;
      }
      if (path.findParent(node => t.isJSXAttribute(node)) || t.isLogicalExpression(path.parent)) {
        return;
      }
      const left = path.get('left');
      const context = getContext(path);
      const identifiers = getIdentifiersInfo(left);
      if (path.node.operator === '&&') {
        const { code } = (0, _generator2.default)(left.node);
        const condition = (0, _ast.createCondition)({ test: code, identifiers });
        (0, _addToContext2.default)(context, condition);
        setContext(path, condition);
        return;
      }
      const { code } = (0, _generator2.default)(left.node);
      const interpolationEscaped = (0, _ast.createInterpolationEscaped)(code, identifiers);
      const condition = (0, _ast.createCondition)({
        test: code,
        consequent: interpolationEscaped,
        identifiers
      });
      (0, _addToContext2.default)(context, condition);
      setContext(path, condition);
    },
    ConditionalExpression(path) {
      if (path.findParent(node => t.isJSXAttribute(node))) {
        return;
      }
      const testPath = path.get('test');
      const context = getContext(path);
      const ignoreConsequent = t.isNullLiteral(path.node.consequent);
      const padding = ignoreConsequent ? 2 : 0;
      const identifiers = getIdentifiersInfo(testPath, padding);
      const { code } = (0, _generator2.default)(testPath.node);
      const test = ignoreConsequent ? `!(${code})` : code;
      const condition = (0, _ast.createCondition)({ test, identifiers });
      (0, _addToContext2.default)(context, condition);
      setContext(path, condition);
    },
    StringLiteral(path) {
      if (path.findParent(node => t.isJSXAttribute(node))) {
        return;
      }
      if (t.isConditionalExpression(path.parent)) {
        const context = getContext(path);
        const text = (0, _ast.createText)(path.node.value);
        (0, _addToContext2.default)(context, text);
      }
    }
  };

  const generalVisitor = {
    ImportDeclaration(path) {
      const source = path.node.source.value;
      const specifier = path.node.specifiers.find(node => t.isImportDefaultSpecifier(node)).local.name;
      table.dependencies[specifier] = { source, requiredFrom: inputFilePath };
    },
    VariableDeclaration(path) {
      checkForReactComponent(path);
    },
    FunctionDeclaration(path) {
      checkForReactComponent(path);
    },
    ExportDefaultDeclaration(path) {
      const exportedComponent = path.node.declaration.name;
      const component = table.components[exportedComponent];
      if (component) {
        component.defaultExport = true;
      }
    }
  };

  (0, _traverse2.default)(oldAst, generalVisitor, null);

  const mainComponent = Object.values(table.components).find(component => component.defaultExport);
  (0, _addToContext2.default)(newAst, mainComponent.node);

  return { ast: newAst, table };

  function checkForReactComponent(path) {
    const is = (0, _isFunctionalReactComponent2.default)(path);
    const name = (0, _getReactComponentName2.default)(path.node);
    const defaultExport = t.isFunctionDeclaration(path.node) ? t.isExportDefaultDeclaration(path.parent) : false;
    const props = (0, _getReactComponentProps2.default)(path.node);
    if (is) {
      const mixin = (0, _ast.createMixin)(name, props);
      setContext(path, mixin);
      table.components[name] = {
        node: mixin,
        defaultExport,
        createdFrom: inputFilePath
      };
      path.traverse(reactComponentVisitor);
    }
  }
}

exports.default = transformation;


function setContext(path, context) {
  path.node._context = context;
}

function getContext(path) {
  const context = path.findParent(pathItem => !!pathItem.node._context).node._context;
  return context;
}

function isMapIterator(node) {
  const callee = node.callee;
  if (!callee || !callee.property) {
    return false;
  }
  const is = callee.property.name === 'map';
  return is;
}

function shouldIgnoreAttr(name) {
  if (['key', 'onClick', 'ref'].includes(name)) {
    return true;
  }
  return false;
}

function getIdentifiersInfo(path, padding = 0) {
  const start = path.node.start;
  const info = {};
  if (t.isIdentifier(path.node)) {
    const { name, info: idInfo } = getIdentifierInfo(path.node, start, padding);
    info[name] = [idInfo];
    return info;
  }
  path.traverse({
    Identifier({ node }) {
      const { name, info: idInfo } = getIdentifierInfo(node, start, padding);
      if (info[name]) {
        info[name].push(idInfo);
      } else {
        info[name] = [idInfo];
      }
    }
  });
  return info;
}

function getIdentifierInfo(node, start, padding) {
  const idStart = node.start - start + padding;
  const idEnd = node.end - start + padding;
  const name = node.name;
  const info = { start: idStart, end: idEnd };
  return { name, info };
}
//# sourceMappingURL=transformation.js.map