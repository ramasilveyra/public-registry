'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

var _endOfStream = require('end-of-stream');

var _endOfStream2 = _interopRequireDefault(_endOfStream);

var _tarFs = require('tar-fs');

var _tarFs2 = _interopRequireDefault(_tarFs);

var _zlib = require('zlib');

var _zlib2 = _interopRequireDefault(_zlib);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

exports.default = (() => {
  var _ref = _asyncToGenerator(function* (tarballPath, destPath) {
    const stream = _fs2.default.createReadStream(tarballPath).pipe(new _zlib2.default.Unzip()).pipe(_tarFs2.default.extract(destPath));

    return new Promise(function (resolve, reject) {
      (0, _endOfStream2.default)(stream, function (err) {
        if (err) {
          return reject(err);
        }
        return resolve();
      });
    });
  });

  function extractTarball(_x, _x2) {
    return _ref.apply(this, arguments);
  }

  return extractTarball;
})();
//# sourceMappingURL=extract-tarball.js.map