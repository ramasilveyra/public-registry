'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _del = require('del');

var _del2 = _interopRequireDefault(_del);

var _makeDir = require('make-dir');

var _makeDir2 = _interopRequireDefault(_makeDir);

var _execLikeShell = require('./exec-like-shell');

var _execLikeShell2 = _interopRequireDefault(_execLikeShell);

var _extractTarball = require('./extract-tarball');

var _extractTarball2 = _interopRequireDefault(_extractTarball);

var _getNpmClient = require('./get-npm-client');

var _getNpmClient2 = _interopRequireDefault(_getNpmClient);

var _getTarballName = require('./get-tarball-name');

var _getTarballName2 = _interopRequireDefault(_getTarballName);

var _getTempDir = require('./get-temp-dir');

var _getTempDir2 = _interopRequireDefault(_getTempDir);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (pkg, pkgPath) {
    const npmClient = yield (0, _getNpmClient2.default)();
    const tarballName = yield (0, _getTarballName2.default)(pkg);
    const pkgTarballFilename = _path2.default.join(pkgPath, tarballName);
    const pkgTempDir = yield (0, _getTempDir2.default)(pkg);
    yield (0, _execLikeShell2.default)(`${npmClient} pack`, pkgPath);
    yield (0, _del2.default)(`${pkgTempDir}/**`, { force: true });
    yield (0, _makeDir2.default)(pkgTempDir);
    yield (0, _extractTarball2.default)(pkgTarballFilename, pkgTempDir);
    yield (0, _del2.default)(pkgTarballFilename);
  });

  function preparePackage(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return preparePackage;
})();
//# sourceMappingURL=prepare-package.js.map