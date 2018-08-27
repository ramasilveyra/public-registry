'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = setRequiredFlagVisitor;

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _getFirstMemberExpression = require('../utils/get-first-member-expression');

var _getFirstMemberExpression2 = _interopRequireDefault(_getFirstMemberExpression);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint-disable no-param-reassign */
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
          const firstMemberExpressionPath = (0, _getFirstMemberExpression2.default)(path);
          flagNode(definitions, firstMemberExpressionPath.node, node);
        }
      }
    }
  };
}
function flagNode(definitions, nodeBabel, nodeUnreact) {
  if (!t.isIdentifier(nodeBabel)) {
    return;
  }
  const defFound = definitions.find(def => def.name === nodeBabel.name);
  if (defFound && defFound.isRequired) {
    nodeUnreact.isRequired = true;
  }
}
//# sourceMappingURL=set-is-required-flag-visitor.js.map