'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _bluebird = require('bluebird');

var _bluebird2 = _interopRequireDefault(_bluebird);

var _semver = require('semver');

var _semver2 = _interopRequireDefault(_semver);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const readFile = _bluebird2.default.promisify(_fs2.default.readFile);

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (pkgPath) {
    const packagePath = _path2.default.resolve(pkgPath, 'package.json');
    try {
      const pkg = JSON.parse((yield readFile(packagePath, 'utf-8')));
      pkg.scripts = pkg.scripts || {};
      validatePackageJSON(pkg);
      return pkg;
    } catch (e) {
      throw e;
    }
  });

  function readPackageManifest(_x) {
    return _ref.apply(this, arguments);
  }

  return readPackageManifest;
})();

function validatePackageJSON(pkg) {
  if (!pkg.name) {
    throw new Error("Package doesn't have a name.");
  }

  if (!pkg.version) {
    throw new Error("Package doesn't have a version.");
  }

  if (!_semver2.default.valid(pkg.version)) {
    throw new Error('Invalid semver version.');
  }
}
//# sourceMappingURL=read-package-manifest.js.map