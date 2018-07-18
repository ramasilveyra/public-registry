'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function getBodyChild(code) {
  let bodyChild = null;
  (0, _traverse2.default)((0, _parser2.default)(`(${code})`), {
    Program(path) {
      const body = path.get('body');
      if (!body) {
        return;
      }
      bodyChild = body[0];
    }
  }, null);
  return bodyChild;
}

exports.default = getBodyChild;
//# sourceMappingURL=get-body-child.js.map