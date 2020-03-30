"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = normalisePackageName;
exports.normalisePackageNameNpm = normalisePackageNameNpm;
exports.normalisePackageNameYarn = normalisePackageNameYarn;

var _getNpmClient = _interopRequireDefault(require("./get-npm-client"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function normalisePackageName(name) {
  const npmClient = await (0, _getNpmClient.default)();

  if (npmClient === 'npm') {
    return normalisePackageNameNpm(name);
  }

  return normalisePackageNameYarn(name);
}

function normalisePackageNameNpm(name) {
  return name[0] === '@' ? name.substr(1).replace(/\//g, '-') : name;
}

function normalisePackageNameYarn(name) {
  return name[0] === '@' ? name.substr(1).replace('/', '-') : name;
}
//# sourceMappingURL=normalise-package-name.js.map