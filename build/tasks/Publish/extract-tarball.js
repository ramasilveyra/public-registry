"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = extractTarball;

var _fs = _interopRequireDefault(require("fs"));

var _endOfStream = _interopRequireDefault(require("end-of-stream"));

var _tarFs = _interopRequireDefault(require("tar-fs"));

var _zlib = _interopRequireDefault(require("zlib"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function extractTarball(tarballPath, destPath) {
  const stream = _fs.default.createReadStream(tarballPath).pipe(new _zlib.default.Unzip()).pipe(_tarFs.default.extract(destPath));

  return new Promise((resolve, reject) => {
    (0, _endOfStream.default)(stream, err => {
      if (err) {
        return reject(err);
      }

      return resolve();
    });
  });
}
//# sourceMappingURL=extract-tarball.js.map