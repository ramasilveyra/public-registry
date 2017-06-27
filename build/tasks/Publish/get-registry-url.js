'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gitRemoteOriginUrl = require('git-remote-origin-url');

var _gitRemoteOriginUrl2 = _interopRequireDefault(_gitRemoteOriginUrl);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (userRegistry, pkg, pkgPath) {
    if (userRegistry) {
      return userRegistry;
    }

    if (pkg && pkg.gitpkg && pkg.gitpkg.registry) {
      return pkg.gitpkg.registry;
    }

    const registryDefault = yield (0, _gitRemoteOriginUrl2.default)(pkgPath);

    return registryDefault;
  });

  function getRegistryURL(_x, _x2, _x3) {
    return _ref.apply(this, arguments);
  }

  return getRegistryURL;
})();
//# sourceMappingURL=get-registry-url.js.map