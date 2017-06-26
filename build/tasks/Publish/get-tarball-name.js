'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getNpmClient = require('./get-npm-client');

var _getNpmClient2 = _interopRequireDefault(_getNpmClient);

var _normalisePackageName = require('./normalise-package-name');

var _normalisePackageName2 = _interopRequireDefault(_normalisePackageName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (pkg) {
    const npmClient = yield (0, _getNpmClient2.default)();
    const packageName = yield (0, _normalisePackageName2.default)(pkg.name);

    if (npmClient === 'npm') {
      const filename = `${packageName}-${pkg.version}.tgz`;
      return filename;
    }

    const filename = `${packageName}-v${pkg.version}.tgz`;
    return filename;
  });

  function getTarballName(_x) {
    return _ref.apply(this, arguments);
  }

  return getTarballName;
})();
//# sourceMappingURL=get-tarball-name.js.map