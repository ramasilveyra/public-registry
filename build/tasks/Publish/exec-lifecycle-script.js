'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _execLikeShell = require('./exec-like-shell');

var _execLikeShell2 = _interopRequireDefault(_execLikeShell);

var _getNpmClient = require('./get-npm-client');

var _getNpmClient2 = _interopRequireDefault(_getNpmClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (script, pkg, pkgPath, onExecute = function () {}) {
    const npmClient = yield (0, _getNpmClient2.default)();
    if (pkg.scripts[script]) {
      yield (0, _execLikeShell2.default)(`${npmClient} run ${script}`, pkgPath);
      yield onExecute();
    }
  });

  function execLifecycleScript(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return execLifecycleScript;
})();
//# sourceMappingURL=exec-lifecycle-script.js.map