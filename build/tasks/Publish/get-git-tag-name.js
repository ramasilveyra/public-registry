"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGitTagName;
exports.defaultTagNameFormat = defaultTagNameFormat;

var _normalisePackageName = require("./normalise-package-name");

function getGitTagName(pkg, config) {
  const gitpkgPackageName = config.getTagName(pkg);
  return gitpkgPackageName;
}
/**
 * Returns the default tag name. This function can be replaced in the config file.
 * @param {object} pkg The package.json object.
 */


function defaultTagNameFormat(pkg) {
  return `${(0, _normalisePackageName.normalisePackageNameNpm)(pkg.name)}-v${pkg.version}-gitpkg`;
}
//# sourceMappingURL=get-git-tag-name.js.map