'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _evaluate = require('./evaluate');

var _evaluate2 = _interopRequireDefault(_evaluate);

var _isTruthy = require('./is-truthy');

var _isTruthy2 = _interopRequireDefault(_isTruthy);

var _ast = require('../ast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/* eslint-disable no-param-reassign, no-underscore-dangle */
const deadCodeElimination = {
  Attribute: {
    exit(node, parent) {
      if (node.isBoolean || node.isString) {
        return;
      }
      if (t.isIdentifier(node.valuePath.node) && node.valuePath.node.name === 'undefined') {
        parent.attributes = parent.attributes.filter(attr => attr !== node);
        return;
      }
      const result = (0, _evaluate2.default)(node.valuePath);
      if (result.confident && ['string', 'number'].includes(typeof result.value)) {
        node.value = result.value;
        node.isString = true;
      } else if (t.isTemplateLiteral(node.valuePath.node)) {
        constantFoldingTemplateLiteral(node.valuePath);
      }
    }
  },
  InterpolationEscaped: {
    exit(node) {
      if (t.isIdentifier(node.valuePath.node, { name: 'undefined' })) {
        // HACK: to "remove" InterpolationEscaped.
        node.valuePath = null;
        node.type = _ast.textName;
        return;
      }

      if (t.isStringLiteral(node.valuePath.node)) {
        node.type = _ast.textName;
        node.value = node.valuePath.node.value;
        delete node.valuePath;
      }
    }
  },
  Condition: {
    enter(node, parent) {
      const pNode = node.testPath.node;
      const isLogicalExpressionAnd = t.isLogicalExpression(pNode, { operator: '&&' });
      const hasStringRight = isLogicalExpressionAnd && t.isIdentifier(pNode.left) && t.isStringLiteral(pNode.right);
      const hasStringLeft = isLogicalExpressionAnd && t.isStringLiteral(pNode.left) && t.isIdentifier(pNode.right);
      if (hasStringRight) {
        node.testPath.replaceWith(t.identifier(pNode.left.name));
      }
      if (hasStringLeft) {
        node.testPath.replaceWith(t.identifier(pNode.right.name));
      }
      const evaluates = (0, _isTruthy2.default)(node.testPath);
      if (evaluates === false) {
        if (parent.type === _ast.conditionName) {
          delete parent.type;
          delete parent.testPath;
          delete parent.alternate;
          delete parent.consequent;
          delete parent._parent;
          delete node._parent;
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
};

exports.default = deadCodeElimination;


function constantFoldingTemplateLiteral(path) {
  path.traverse({
    ConditionalExpression(nodePath) {
      const result = nodePath.evaluate();
      if (result.confident && typeof result.value === 'string') {
        const nodeStart = nodePath.node.start;
        const nodeIndex = nodePath.parent.expressions.findIndex(expr => expr === nodePath.node);
        nodePath.parent.quasis = nodePath.parent.quasis.map(q => {
          const placeholdersStart = 2; // placeholders start symbols length "${".
          if (q.end === nodeStart - placeholdersStart) {
            q.value.cooked += result.value;
            q.value.raw += result.value;
          }
          return q;
        });
        nodePath.remove();
        const quasiExtra = nodePath.parentPath.get(`quasis.${nodeIndex + 1}`);
        const quasiExtraValue = quasiExtra.node.value.cooked;
        quasiExtra.remove();
        const quasiBefore = nodePath.parentPath.get(`quasis.${nodeIndex}`);
        quasiBefore.node.value.cooked += quasiExtraValue;
        quasiBefore.node.value.raw += quasiExtraValue;
      }
    }
  });
}
//# sourceMappingURL=dead-code-elimination-visitor.js.map