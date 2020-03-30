"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTarballName;

var _getNpmClient = _interopRequireDefault(require("./get-npm-client"));

var _normalisePackageName = _interopRequireDefault(require("./normalise-package-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getTarballName(pkg) {
  const npmClient = await (0, _getNpmClient.default)();
  const packageName = await (0, _normalisePackageName.default)(pkg.name);

  if (npmClient === 'npm') {
    const filename = `${packageName}-${pkg.version}.tgz`;
    return filename;
  }

  const filename = `${packageName}-v${pkg.version}.tgz`;
  return filename;
}
//# sourceMappingURL=get-tarball-name.js.map