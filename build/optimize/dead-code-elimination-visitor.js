'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _evaluate = require('./evaluate');

var _evaluate2 = _interopRequireDefault(_evaluate);

var _isTruthy = require('./is-truthy');

var _isTruthy2 = _interopRequireDefault(_isTruthy);

var _ast = require('../ast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const deadCodeElimination = {
  Attribute: {
    exit(node, parent) {
      if (node.value === 'undefined') {
        parent.attributes = parent.attributes.filter(attr => attr !== node);
        return;
      }
      if (node.expression) {
        const result = (0, _evaluate2.default)(node.value);
        const remove = result.confident && [null, undefined].includes(result.value);
        if (remove) {
          parent.attributes = parent.attributes.filter(attr => attr !== node);
          return;
        }
        if (result.confident && ['string', 'number'].includes(typeof result.value)) {
          node.value = result.value;
          node.expression = false;
        }
      }
    }
  },
  InterpolationEscaped: {
    exit(node) {
      if (node.value === 'undefined') {
        // HACK: to "remove" InterpolationEscaped.
        node.value = '';
        node.type = _ast.textName;
      }
    }
  },
  Condition: {
    enter(node, parent) {
      const evaluates = (0, _isTruthy2.default)(node.test);
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
}; /* eslint-disable no-param-reassign */
exports.default = deadCodeElimination;
//# sourceMappingURL=dead-code-elimination-visitor.js.map