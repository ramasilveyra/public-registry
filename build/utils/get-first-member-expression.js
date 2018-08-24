'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function getFirstMemberExpression(path) {
  let firstMemberExpressionPath = path;
  while (t.isMemberExpression(firstMemberExpressionPath) || t.isCallExpression(firstMemberExpressionPath)) {
    const objectPath = firstMemberExpressionPath.get('object');
    const calleePath = firstMemberExpressionPath.get('callee');
    if (objectPath.node) {
      firstMemberExpressionPath = objectPath;
    }
    if (calleePath.node) {
      firstMemberExpressionPath = calleePath;
    }
  }
  return firstMemberExpressionPath;
}

exports.default = getFirstMemberExpression;
//# sourceMappingURL=get-first-member-expression.js.map