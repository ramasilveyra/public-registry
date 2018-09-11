'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getReactComponentName;

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getReactComponentName(node) {
  const isVariableDeclaration = t.isVariableDeclaration(node);
  const isFunctionDeclaration = t.isFunctionDeclaration(node);
  const nameVariable = isVariableDeclaration && node.declarations[0].id.name;
  const nameFunction = isFunctionDeclaration && node.id.name;
  const name = nameVariable || nameFunction;
  return name;
}
//# sourceMappingURL=get-react-component-name.js.map