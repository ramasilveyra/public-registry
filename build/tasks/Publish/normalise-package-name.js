'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getNpmClient = require('./get-npm-client');

var _getNpmClient2 = _interopRequireDefault(_getNpmClient);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (name) {
    const npmClient = yield (0, _getNpmClient2.default)();

    if (npmClient === 'npm') {
      return normalisePackageNameNpm(name);
    }

    return normalisePackageNameYarn(name);
  });

  function normalisePackageName(_x) {
    return _ref.apply(this, arguments);
  }

  return normalisePackageName;
})();

function normalisePackageNameNpm(name) {
  return name[0] === '@' ? name.substr(1).replace(/\//g, '-') : name;
}

function normalisePackageNameYarn(name) {
  return name[0] === '@' ? name.substr(1).replace('/', '-') : name;
}
//# sourceMappingURL=normalise-package-name.js.map