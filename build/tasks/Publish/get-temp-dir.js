'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _os = require('os');

var _os2 = _interopRequireDefault(_os);

var _path = require('path');

var _path2 = _interopRequireDefault(_path);

var _normalisePackageName = require('./normalise-package-name');

var _normalisePackageName2 = _interopRequireDefault(_normalisePackageName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (pkg) {
    const packageNameNormalised = yield (0, _normalisePackageName2.default)(pkg.name);
    const tempDir = _path2.default.join(_os2.default.tmpdir(), 'gitpkg', `${packageNameNormalised}-${pkg.version}`);
    return tempDir;
  });

  function getTempDir(_x) {
    return _ref.apply(this, arguments);
  }

  return getTempDir;
})();
//# sourceMappingURL=get-temp-dir.js.map