'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = unreactCLI;

var _yargs = require('yargs');

var _yargs2 = _interopRequireDefault(_yargs);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _index = require('./index');

var _package = require('../package.json');

var _package2 = _interopRequireDefault(_package);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function unreactCLI(argv) {
  console.log(_chalk2.default.bold.white(`${_package2.default.name} v${_package2.default.version}`));

  const parsedArgv = (0, _yargs2.default)(argv).option('o', {
    alias: 'out-file',
    describe: 'Output file',
    type: 'string'
  }).option('O', {
    alias: 'out-dir',
    describe: 'Output dir',
    type: 'string'
  }).option('t', {
    alias: 'template-engine',
    describe: 'Output template engine',
    type: 'string',
    default: 'pug',
    choices: ['pug', 'ejs']
  }).option('add-beginning', {
    describe: 'Add string to the beginning of the output file',
    type: 'string'
  }).option('add-ending', {
    describe: 'Add string to the ending of the output file',
    type: 'string'
  }).option('initial-indent-level', {
    describe: 'Start at <number> indent level',
    type: 'number',
    default: 0
  }).usage(`${_package2.default.description}.\nUsage: $0 <file or dir> [options]`).version().alias('version', 'v').help().alias('help', 'h').argv;
  const fileOrDir = parsedArgv._[0];
  const spinner = (0, _ora2.default)({ text: 'Processing...' });
  const progress = report => {
    spinner.stopAndPersist({ text: `${_chalk2.default.gray(report)}` });
  };
  const templateEngine = parsedArgv.t;
  const beginning = parsedArgv['add-beginning'];
  const ending = parsedArgv['add-ending'];
  const initialIndentLevel = parsedArgv['initial-indent-level'];

  if (fileOrDir && parsedArgv.o) {
    spinner.start();
    return (0, _index.compileFile)(fileOrDir, parsedArgv.o, {
      templateEngine,
      beginning,
      ending,
      initialIndentLevel,
      progress
    }).then(() => {
      spinner.succeed(`${_chalk2.default.bold.green('success')} file transformed to ${templateEngine}`);
    }).catch(err => {
      spinner.stopAndPersist();
      spinner.fail(`${_chalk2.default.bold.red('error')} ${err.stack}`);
      process.exit(1);
    });
  }

  if (fileOrDir && parsedArgv.O) {
    spinner.start();
    return (0, _index.compileDir)(fileOrDir, parsedArgv.O, {
      templateEngine,
      beginning,
      ending,
      initialIndentLevel,
      progress
    }).then(() => {
      spinner.succeed(`${_chalk2.default.bold.green('success')} folder transformed to ${templateEngine}`);
    }).catch(err => {
      spinner.stopAndPersist();
      spinner.fail(`${_chalk2.default.bold.red('error')} ${err.message}`);
      process.exit(1);
    });
  }

  return null;
} /* eslint-disable no-console */
//# sourceMappingURL=cli.js.map