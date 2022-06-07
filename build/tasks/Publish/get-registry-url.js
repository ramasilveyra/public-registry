"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getRegistryURL;

var _gitRemoteOriginUrl = _interopRequireDefault(require("git-remote-origin-url"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function getRegistryURL(userRegistry, pkg, pkgPath, config) {
  if (userRegistry) {
    return userRegistry;
  }

  if (config && config.registry) {
    return config.registry;
  }

  if (pkg && pkg.gitpkg && pkg.gitpkg.registry) {
    return pkg.gitpkg.registry;
  }

  const registryDefault = await (0, _gitRemoteOriginUrl.default)(pkgPath);
  return registryDefault;
}
//# sourceMappingURL=get-registry-url.js.map