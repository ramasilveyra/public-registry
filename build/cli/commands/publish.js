"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.describe = exports.command = exports.builder = void 0;

var _ora = _interopRequireDefault(require("ora"));

var _chalk = _interopRequireDefault(require("chalk"));

var _package = _interopRequireDefault(require("../../../package.json"));

var _Publish = _interopRequireDefault(require("../../tasks/Publish"));

var _readConfig = require("../../tasks/Task/read-config");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const command = 'publish';
exports.command = command;
const describe = 'Publishes a package to a git repository as git tag';
exports.describe = describe;
const builder = {
  r: {
    alias: 'registry',
    demandOption: false,
    describe: 'Specify the gitpkg registry (defaults to the git remote origin url)',
    type: 'string'
  }
};
exports.builder = builder;

const handler = async argv => {
  /* eslint-disable no-console */
  console.log(_chalk.default.bold.white(`gitpkg publish v${_package.default.version}`));
  const spinner = (0, _ora.default)({
    text: 'Processing...'
  }).start();
  const publish = new _Publish.default();
  publish.on('subtask', (subtaskNumber, subtaskCount, subtaskName) => {
    spinner.text = `${_chalk.default.gray(`[${subtaskNumber}/${subtaskCount}]`)} ${subtaskName}...`;
  });
  const configFilePath = await (0, _readConfig.getNearestConfigFile)();
  return publish.run({
    registry: argv.registry,
    pkgPath: process.cwd(),
    configPath: configFilePath
  }).then(packageInfo => {
    spinner.succeed(`${_chalk.default.bold.green('success')} Package uploaded to ${packageInfo.gitpkgRegistry} with the name ${packageInfo.gitpkgPackage}.`);
    console.log(`+ ${packageInfo.name}@${packageInfo.version}`);
  }).catch(err => {
    spinner.stopAndPersist();
    spinner.fail(`${_chalk.default.bold.red('error')} ${err.message}`);
    process.exit(1);
  });
};

exports.handler = handler;
//# sourceMappingURL=publish.js.map