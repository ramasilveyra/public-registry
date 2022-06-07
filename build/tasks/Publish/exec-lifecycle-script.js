"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = execLifecycleScript;

var _execLikeShell = _interopRequireDefault(require("./exec-like-shell"));

var _getNpmClient = _interopRequireDefault(require("./get-npm-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function execLifecycleScript(script, pkg, pkgPath, onExecute = () => {}) {
  const npmClient = await (0, _getNpmClient.default)();

  if (pkg.scripts[script]) {
    await (0, _execLikeShell.default)(`${npmClient} run ${script}`, pkgPath);
    await onExecute();
  }
}
//# sourceMappingURL=exec-lifecycle-script.js.map