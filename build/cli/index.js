"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _yargs = _interopRequireDefault(require("yargs"));

var _package = _interopRequireDefault(require("../../package.json"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-expressions
var _default = argv => (0, _yargs.default)(argv).commandDir('commands').usage(`${_package.default.description}.\nUsage: $0 <command> [options]`).version(_package.default.version).alias('version', 'v').help().alias('help', 'h').argv;

exports.default = _default;
//# sourceMappingURL=index.js.map