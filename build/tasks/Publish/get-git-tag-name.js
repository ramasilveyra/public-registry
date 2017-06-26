"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getGitTagName;
function getGitTagName(pkg) {
  const gitpkgPackageName = `${pkg.name}@${pkg.version}-gitpkg`;
  return gitpkgPackageName;
}
//# sourceMappingURL=get-git-tag-name.js.map