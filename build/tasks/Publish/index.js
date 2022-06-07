"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _Task = _interopRequireDefault(require("../Task"));

var _execLifecycleScript = _interopRequireDefault(require("./exec-lifecycle-script"));

var _preparePackage = _interopRequireDefault(require("./prepare-package"));

var _uploadPackage = _interopRequireDefault(require("./upload-package"));

var _getRegistryUrl = _interopRequireDefault(require("./get-registry-url"));

var _getGitTagName = _interopRequireDefault(require("./get-git-tag-name"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

class PublishTask extends _Task.default {
  async run({
    registry,
    configPath,
    pkgPath
  }) {
    this.emit('subtask', 1, 6, '🎛  Reading config file'); // 1 - Read config.

    await this.readConfigFile(configPath);
    this.emit('subtask', 2, 6, '👀  Reading and validating package.json'); // 1 - Read and validate package.json.

    await this.readPackageManifest(pkgPath);
    this.emit('subtask', 3, 6, '🏇  Running prepublish scripts'); // 2 - Run prepublish scripts.
    // NOTE: this scripts might modify the package.json so we need to reload it.

    await (0, _execLifecycleScript.default)('prepublish', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    });
    await (0, _execLifecycleScript.default)('prepublishOnly', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    });
    await (0, _execLifecycleScript.default)('prepare', this.pkg, pkgPath, async () => {
      await this.readPackageManifest(pkgPath);
    }); // 3 - Prepare package: npm pack and untar tarball to temp dir.

    this.emit('subtask', 4, 6, '⚙️  Preparing package');
    await (0, _preparePackage.default)(this.pkg, pkgPath);
    this.emit('subtask', 5, 6, '⬆️  Uploading package'); // 4 - Upload package: create git tag from temp dir
    // and push to resolved gitpkg registry.

    const gitpkgRegistryURL = await (0, _getRegistryUrl.default)(registry, this.pkg, pkgPath, this.config);
    await (0, _uploadPackage.default)(this.config, this.pkg, gitpkgRegistryURL); // 5 - Run postpublish scripts.

    this.emit('subtask', 6, 6, '🏇 Running postpublish scripts');
    await (0, _execLifecycleScript.default)('postpublish', this.pkg, pkgPath);
    return {
      gitpkgRegistry: gitpkgRegistryURL,
      gitpkgPackage: (0, _getGitTagName.default)(this.pkg, this.config),
      name: this.pkg.name,
      version: this.pkg.version
    };
  }

}

exports.default = PublishTask;
//# sourceMappingURL=index.js.map