"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = uploadPackage;

var _path = _interopRequireDefault(require("path"));

var _execLikeShell = _interopRequireDefault(require("./exec-like-shell"));

var _getTempDir = _interopRequireDefault(require("./get-temp-dir"));

var _getGitTagName = _interopRequireDefault(require("./get-git-tag-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function uploadPackage(config, pkg, registry) {
  const pkgTempDir = await (0, _getTempDir.default)(pkg);

  const pkgTempDirPkg = _path.default.join(pkgTempDir, 'package');

  const gitpkgPackageName = (0, _getGitTagName.default)(pkg, config);
  await (0, _execLikeShell.default)('git init', pkgTempDirPkg);
  await (0, _execLikeShell.default)('git add .', pkgTempDirPkg);
  await (0, _execLikeShell.default)('git commit --no-verify -m gitpkg', pkgTempDirPkg);
  await (0, _execLikeShell.default)(`git remote add origin ${registry}`, pkgTempDirPkg);
  await (0, _execLikeShell.default)(`git tag ${gitpkgPackageName}`, pkgTempDirPkg);

  try {
    await (0, _execLikeShell.default)(`git push origin ${gitpkgPackageName}`, pkgTempDirPkg);
  } catch (err) {
    const gitErrorExists = 'Updates were rejected because the tag already exists in the remote.';
    const exists = err.stderr.indexOf(gitErrorExists) > -1;

    if (exists) {
      throw new Error(`The git tag "${gitpkgPackageName}" already exists in "${registry}".`);
    }

    throw err;
  }
}
//# sourceMappingURL=upload-package.js.map