'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getReactComponentProps;

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getReactComponentProps(node) {
  const isVariableDeclaration = t.isVariableDeclaration(node);
  const propsRaw = isVariableDeclaration ? getPropsRawFromVar(node) : node.params[0];
  const props = convertPropsToArray(propsRaw);
  return props;
}

function convertPropsToArray(propsRaw) {
  if (!propsRaw || !t.isObjectPattern(propsRaw)) {
    return null;
  }
  const props = propsRaw.properties.map(prop => prop.value.name);
  return props;
}

function getPropsRawFromVar(node) {
  const varValue = node.declarations[0].init;
  if (t.isArrowFunctionExpression(varValue)) {
    return varValue.params[0];
  }
  return false;
}
//# sourceMappingURL=get-react-component-props.js.map