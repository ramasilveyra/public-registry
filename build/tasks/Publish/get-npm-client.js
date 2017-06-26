'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

let shouldUseYarn = (() => {
  var _ref2 = _asyncToGenerator(function* () {
    try {
      yield (0, _execa2.default)('yarn', ['--version']);
      return true;
    } catch (e) {
      return false;
    }
  });

  return function shouldUseYarn() {
    return _ref2.apply(this, arguments);
  };
})();

var _execa = require('execa');

var _execa2 = _interopRequireDefault(_execa);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

let cacheNpmClient = null;

exports.default = (() => {
  var _ref = _asyncToGenerator(function* () {
    if (cacheNpmClient) {
      return cacheNpmClient;
    }

    const useYarn = yield shouldUseYarn();
    const npmClient = useYarn ? 'yarn' : 'npm';
    cacheNpmClient = npmClient;

    return npmClient;
  });

  function getNpmClient() {
    return _ref.apply(this, arguments);
  }

  return getNpmClient;
})();
//# sourceMappingURL=get-npm-client.js.map