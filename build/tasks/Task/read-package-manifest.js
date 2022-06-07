"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = readPackageManifest;

var _fs = _interopRequireDefault(require("fs"));

var _path = _interopRequireDefault(require("path"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _semver = _interopRequireDefault(require("semver"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const readFile = _bluebird.default.promisify(_fs.default.readFile);

async function readPackageManifest(pkgPath) {
  const packagePath = _path.default.resolve(pkgPath, 'package.json');

  const pkg = JSON.parse(await readFile(packagePath, 'utf-8'));
  pkg.scripts = pkg.scripts || {};
  validatePackageJSON(pkg);
  return pkg;
}

function validatePackageJSON(pkg) {
  if (!pkg.name) {
    throw new Error("Package doesn't have a name.");
  }

  if (!pkg.version) {
    throw new Error("Package doesn't have a version.");
  }

  if (!_semver.default.valid(pkg.version)) {
    throw new Error('Invalid semver version.');
  }
}
//# sourceMappingURL=read-package-manifest.js.map