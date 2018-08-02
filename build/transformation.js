'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

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
      const expressionNode = expressionPath.node;

      if (t.isLogicalExpression(expressionNode, { operator: '&&' })) {
        return;
      }
      if (t.isLogicalExpression(expressionNode, { operator: '||' })) {
        return;
      }
      if (t.isConditionalExpression(expressionNode)) {
        return;
      }
      if (isMapIterator(expressionNode)) {
        return;
      }

      const context = getContext(path);
      const interpolationEscaped = (0, _ast.createInterpolationEscaped)(expressionPath);
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
        const attribute = (0, _ast.createAttribute)({ name, value: true, isBoolean: true });
        (0, _addToContext2.default)(context, attribute, 'attributes');
        return;
      }
      if (t.isStringLiteral(valueNode)) {
        const attribute = (0, _ast.createAttribute)({ name, value: valueNode.value, isString: true });
        (0, _addToContext2.default)(context, attribute, 'attributes');
        return;
      }
      const expression = path.get('value.expression');
      if (name === 'style') {
        const styles = {};
        expression.node.properties.forEach(prop => {
          styles[prop.key.name] = prop.value.value;
        });
        const stringInlineStyles = (0, _inlineStyles2.default)(styles);
        if (stringInlineStyles) {
          const attribute = (0, _ast.createAttribute)({ name, value: stringInlineStyles, isString: true });
          (0, _addToContext2.default)(context, attribute, 'attributes');
        }
        return;
      }
      const attribute = (0, _ast.createAttribute)({ name, valuePath: expression });
      (0, _addToContext2.default)(context, attribute, 'attributes');
    },
    CallExpression(path) {
      const isIterator = isMapIterator(path.node);
      if (isIterator) {
        const iterablePath = path.get('callee.object');
        const currentValuePath = path.get('arguments.0.params.0');
        const indexPath = path.get('arguments.0.params.1');
        const arrayPath = path.get('arguments.0.params.2');
        const iteration = (0, _ast.createIteration)({ iterablePath, currentValuePath, indexPath, arrayPath });
        const context = getContext(path);
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
      if (path.node.operator === '&&') {
        const condition = (0, _ast.createCondition)({ testPath: left });
        (0, _addToContext2.default)(context, condition);
        setContext(path, condition);
        return;
      }
      const interpolationEscaped = (0, _ast.createInterpolationEscaped)(left);
      const condition = (0, _ast.createCondition)({ testPath: left, consequent: interpolationEscaped });
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
      if (ignoreConsequent) {
        testPath.replaceWith(t.UnaryExpression('!', testPath.node));
      }
      const condition = (0, _ast.createCondition)({ testPath });
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
    },
    ObjectExpression(path) {
      const parent = path.parent;
      if (!t.isAssignmentExpression(parent, { operator: '=' }) || !t.isMemberExpression(parent.left) || !t.isObjectExpression(parent.right) || !t.isIdentifier(parent.left.object) || !(t.isIdentifier(parent.left.property, { name: 'propTypes' }) || t.isIdentifier(parent.left.property, { name: 'defaultProps' }))) {
        return;
      }
      const isPropTypes = t.isIdentifier(parent.left.property, { name: 'propTypes' });
      const isDefaultProps = t.isIdentifier(parent.left.property, { name: 'defaultProps' });
      const componentName = parent.left.object.name;
      const component = table.components[componentName];
      if (!component.definitions) {
        component.definitions = path.node.properties.map((node, index) => createDefinition({ node, index, isPropTypes, isDefaultProps, path }));
      }
      path.node.properties.forEach((node, index) => {
        component.definitions = component.definitions.map(definition => {
          if (definition.name === node.key.name) {
            return createDefinition({ definition, node, index, isPropTypes, isDefaultProps, path });
          }
          return definition;
        });
      });
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
} /* eslint-disable no-underscore-dangle, no-param-reassign */
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

function createDefinition({ definition, node, index, isPropTypes, isDefaultProps, path }) {
  const newDef = Object.assign({}, definition);
  if (!newDef.name) {
    newDef.name = node.key.name;
  }
  if (isPropTypes) {
    newDef.isRequired = t.isMemberExpression(node.value) && t.isIdentifier(node.value.property, { name: 'isRequired' });
  }
  if (isDefaultProps) {
    newDef.defaultPath = path.get(`properties.${index}.value`);
  }
  return newDef;
}
//# sourceMappingURL=transformation.js.map