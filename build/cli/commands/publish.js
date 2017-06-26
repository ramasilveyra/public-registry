'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.handler = exports.builder = exports.describe = exports.command = undefined;

var _ora = require('ora');

var _ora2 = _interopRequireDefault(_ora);

var _chalk = require('chalk');

var _chalk2 = _interopRequireDefault(_chalk);

var _package = require('../../../package.json');

var _package2 = _interopRequireDefault(_package);

var _Publish = require('../../tasks/Publish');

var _Publish2 = _interopRequireDefault(_Publish);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const command = exports.command = 'publish';

const describe = exports.describe = 'Publishes a package to a git repository as git tag';

const builder = exports.builder = {
  r: {
    alias: 'registry',
    demandOption: false,
    describe: 'Specify the gitpkg registry (defaults to the git remote origin url)',
    type: 'string'
  }
};

const handler = exports.handler = argv => {
  /* eslint-disable no-console */
  console.log(_chalk2.default.bold.white(`gitpkg publish v${_package2.default.version}`));
  const spinner = (0, _ora2.default)({ text: 'Processing...' }).start();

  const publish = new _Publish2.default();
  publish.on('subtask', (subtaskNumber, subtaskCount, subtaskName) => {
    spinner.text = `${_chalk2.default.gray(`[${subtaskNumber}/${subtaskCount}]`)} ${subtaskName}...`;
  });

  return publish.run({ registry: argv.registry }).then(packageInfo => {
    spinner.succeed(`${_chalk2.default.bold.green('success')} Package uploaded to ${packageInfo.gitpkgRegistry} with the name ${packageInfo.gitpkgPackage}.`);
    console.log(`+ ${packageInfo.name}@${packageInfo.version}`);
  }).catch(err => {
    spinner.stopAndPersist();
    spinner.fail(`${_chalk2.default.bold.red('error')} ${err.message}`);
    process.exit(1);
  });
};
//# sourceMappingURL=publish.js.map