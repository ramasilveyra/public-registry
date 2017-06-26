'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _events = require('events');

var _events2 = _interopRequireDefault(_events);

var _readPackageManifest = require('./read-package-manifest');

var _readPackageManifest2 = _interopRequireDefault(_readPackageManifest);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

const EventEmitter = _events2.default.EventEmitter;

class Task extends EventEmitter {
  constructor() {
    super();
    this.pkg = null;
  }

  readPackageManifest(pkgPath) {
    var _this = this;

    return _asyncToGenerator(function* () {
      _this.pkg = yield (0, _readPackageManifest2.default)(pkgPath);
    })();
  }
}
exports.default = Task;
//# sourceMappingURL=index.js.map