'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _execLikeShell = require('./exec-like-shell');

var _execLikeShell2 = _interopRequireDefault(_execLikeShell);

var _getTempDir = require('./get-temp-dir');

var _getTempDir2 = _interopRequireDefault(_getTempDir);

var _getGitTagName = require('./get-git-tag-name');

var _getGitTagName2 = _interopRequireDefault(_getGitTagName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (pkg, pkgPath, registry) {
    const pkgTempDir = yield (0, _getTempDir2.default)(pkg);
    const pkgTempDirPkg = _path2.default.join(pkgTempDir, 'package');
    const gitpkgPackageName = (0, _getGitTagName2.default)(pkg);
    yield (0, _execLikeShell2.default)('git init', pkgTempDirPkg);
    yield (0, _execLikeShell2.default)('git add .', pkgTempDirPkg);
    yield (0, _execLikeShell2.default)('git commit -m gitpkg', pkgTempDirPkg);
    yield (0, _execLikeShell2.default)(`git remote add origin ${registry}`, pkgTempDirPkg);
    yield (0, _execLikeShell2.default)(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);
    try {
      yield (0, _execLikeShell2.default)(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
    } catch (err) {
      const gitErrorExists = 'Updates were rejected because the tag already exists in the remote.';
      const exists = err.stderr.indexOf(gitErrorExists) > -1;
      if (exists) {
        throw new Error(`The git tag "${gitpkgPackageName}" already exists in "${registry}".`);
      }

      throw err;
    }
  });

  function uploadPackage(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return uploadPackage;
})();
//# sourceMappingURL=upload-package.js.map