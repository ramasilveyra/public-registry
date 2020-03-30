"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getTempDir;

var _os = _interopRequireDefault(require("os"));

var _path = _interopRequireDefault(require("path"));

var _normalisePackageName = _interopRequireDefault(require("./normalise-package-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getTempDir(pkg) {
  const packageNameNormalised = await (0, _normalisePackageName.default)(pkg.name);

  const tempDir = _path.default.join(_os.default.tmpdir(), 'gitpkg', `${packageNameNormalised}-${pkg.version}`);

  return tempDir;
}
//# sourceMappingURL=get-temp-dir.js.map