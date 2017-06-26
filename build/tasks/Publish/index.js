'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _Task = require('../Task');

var _Task2 = _interopRequireDefault(_Task);

var _execLifecycleScript = require('./exec-lifecycle-script');

var _execLifecycleScript2 = _interopRequireDefault(_execLifecycleScript);

var _preparePackage = require('./prepare-package');

var _preparePackage2 = _interopRequireDefault(_preparePackage);

var _uploadPackage = require('./upload-package');

var _uploadPackage2 = _interopRequireDefault(_uploadPackage);

var _getRegistryUrl = require('./get-registry-url');

var _getRegistryUrl2 = _interopRequireDefault(_getRegistryUrl);

var _getGitTagName = require('./get-git-tag-name');

var _getGitTagName2 = _interopRequireDefault(_getGitTagName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

class PublishTask extends _Task2.default {
  run({ registry, pkgPath = process.cwd() } = {}) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.emit('subtask', 1, 5, '👀  Reading and validating package.json');
      // 1 - Read and validate package.json.
      yield _this.readPackageManifest(pkgPath);
      _this.emit('subtask', 2, 5, '🏇  Running prepublish scripts');
      // 2 - Run prepublish scripts.
      // NOTE: this scripts might modify the package.json so we need to reload it.
      yield (0, _execLifecycleScript2.default)('prepublish', _this.pkg, pkgPath, _asyncToGenerator(function* () {
        yield _this.readPackageManifest(pkgPath);
      }));
      yield (0, _execLifecycleScript2.default)('prepublishOnly', _this.pkg, pkgPath, _asyncToGenerator(function* () {
        yield _this.readPackageManifest(pkgPath);
      }));
      yield (0, _execLifecycleScript2.default)('prepare', _this.pkg, pkgPath, _asyncToGenerator(function* () {
        yield _this.readPackageManifest(pkgPath);
      }));
      // 3 - Prepare package: npm pack and untar tarball to temp dir.
      _this.emit('subtask', 3, 5, '⚙️  Preparing package');
      yield (0, _preparePackage2.default)(_this.pkg, pkgPath);
      _this.emit('subtask', 4, 5, '⬆️  Uploading package');
      // 4 - Upload package: create git tag from temp dir
      // and push to resolved gitpkg registry.
      const gitpkgRegistryURL = yield (0, _getRegistryUrl2.default)(registry, _this.pkg, pkgPath);
      yield (0, _uploadPackage2.default)(_this.pkg, pkgPath, gitpkgRegistryURL);
      // 5 - Run postpublish scripts.
      _this.emit('subtask', 5, 5, '🏇 Running postpublish scripts');
      yield (0, _execLifecycleScript2.default)('publish', _this.pkg, pkgPath);
      yield (0, _execLifecycleScript2.default)('postpublish', _this.pkg, pkgPath);

      return {
        gitpkgRegistry: gitpkgRegistryURL,
        gitpkgPackage: (0, _getGitTagName2.default)(_this.pkg),
        name: _this.pkg.name,
        version: _this.pkg.version
      };
    })();
  }
}
exports.default = PublishTask;
//# sourceMappingURL=index.js.map