'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRequiredFlagVisitor;

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function setRequiredFlagVisitor(definitions) {
  if (!definitions) {
    return {};
  }
  return {
    Attribute: {
      exit(node) {
        const path = node.valuePath;
        if (!path) {
          return;
        }
        flagNode(definitions, path.node, node);
        if (t.isMemberExpression(path.node) || t.isCallExpression(path.node)) {
          const firstMemberExpression = getFirstMemberExpression(path.node);
          flagNode(definitions, firstMemberExpression, node);
        }
      }
    }
  };
} /* eslint-disable no-param-reassign */

function flagNode(definitions, nodeBabel, nodeUnreact) {
  if (!t.isIdentifier(nodeBabel)) {
    return;
  }
  const defFound = definitions.find(def => def.name === nodeBabel.name);
  if (defFound && defFound.isRequired) {
    nodeUnreact.isRequired = true;
  }
}

function getFirstMemberExpression(node) {
  let firstMemberExpression = node;
  while (t.isMemberExpression(firstMemberExpression) || t.isCallExpression(firstMemberExpression)) {
    firstMemberExpression = firstMemberExpression.object || firstMemberExpression.callee;
  }
  return firstMemberExpression;
}
//# sourceMappingURL=set-is-required-flag-visitor.js.map