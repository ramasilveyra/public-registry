"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = preparePackage;

var _path = _interopRequireDefault(require("path"));

var _del = _interopRequireDefault(require("del"));

var _makeDir = _interopRequireDefault(require("make-dir"));

var _execLikeShell = _interopRequireDefault(require("./exec-like-shell"));

var _extractTarball = _interopRequireDefault(require("./extract-tarball"));

var _getNpmClient = _interopRequireDefault(require("./get-npm-client"));

var _getTarballName = _interopRequireDefault(require("./get-tarball-name"));

var _getTempDir = _interopRequireDefault(require("./get-temp-dir"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function preparePackage(pkg, pkgPath) {
  const npmClient = await (0, _getNpmClient.default)();
  const tarballName = await (0, _getTarballName.default)(pkg);

  const pkgTarballFilename = _path.default.join(pkgPath, tarballName);

  const pkgTempDir = await (0, _getTempDir.default)(pkg);
  await (0, _execLikeShell.default)(`${npmClient} pack`, pkgPath);
  await (0, _del.default)(`${pkgTempDir}/**`, {
    force: true
  });
  await (0, _makeDir.default)(pkgTempDir);
  await (0, _extractTarball.default)(pkgTarballFilename, pkgTempDir);
  await (0, _del.default)(pkgTarballFilename);
}
//# sourceMappingURL=prepare-package.js.map