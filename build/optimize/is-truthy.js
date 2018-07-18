'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getBodyChild = require('../utils/get-body-child');

var _getBodyChild2 = _interopRequireDefault(_getBodyChild);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function isTruthy(code) {
  const bodyChild = (0, _getBodyChild2.default)(code);
  if (!bodyChild) {
    return null;
  }
  const evaluates = bodyChild.evaluateTruthy();
  return evaluates;
}

exports.default = isTruthy;
//# sourceMappingURL=is-truthy.js.map