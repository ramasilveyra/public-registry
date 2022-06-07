"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = execLikeShell;

var _execa = _interopRequireDefault(require("execa"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function execLikeShell(command, cwd) {
  const [program, ...options] = command.split(' ');
  return (0, _execa.default)(program, options, {
    cwd
  });
}
//# sourceMappingURL=exec-like-shell.js.map