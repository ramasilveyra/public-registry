'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _package = require('../../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// eslint-disable-next-line no-unused-expressions
exports.default = argv => (0, _yargs2.default)(argv).commandDir('commands').usage(`${_package2.default.description}.\nUsage: $0 <command> [options]`).version(() => _package2.default.version).alias('version', 'v').help().alias('help', 'h').argv;
//# sourceMappingURL=index.js.map