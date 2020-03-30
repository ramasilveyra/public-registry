"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getNearestConfigFile = getNearestConfigFile;
exports.default = readConfig;
exports.defaultConfig = exports.configFileName = void 0;

var _findUp = _interopRequireDefault(require("find-up"));

var _fs = _interopRequireDefault(require("fs"));

var _bluebird = _interopRequireDefault(require("bluebird"));

var _path = _interopRequireDefault(require("path"));

var _getGitTagName = require("../Publish/get-git-tag-name");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

const access = _bluebird.default.promisify(_fs.default.access);
/**
 * The name of the config file.
 */


const configFileName = 'gitpkg.config.js';
/**
 * Here goes any default values.
 */

exports.configFileName = configFileName;
const defaultConfig = {
  registry: null,
  getTagName: _getGitTagName.defaultTagNameFormat
};
exports.defaultConfig = defaultConfig;

async function getNearestConfigFile() {
  // First check if config file is in same dir
  try {
    if (await access(_path.default.resolve(process.cwd(), configFileName))) {
      return configFileName;
    }
  } catch (e) {} // Ignore
  // Then check in parent directories


  return (0, _findUp.default)(configFileName);
}
/**
 * Returns an object with configurable settings.
 *
 * @param {string} directory Path to config file.
 */


async function readConfig(configPath) {
  try {
    const configClass = await Promise.resolve().then(() => _interopRequireWildcard(require(`${configPath}`)));
    let config = {};

    if (typeof configClass.default === 'function') {
      config = configClass.default();
    } else if (typeof configClass === 'function') {
      config = configClass();
    }

    return { ...defaultConfig,
      ...config
    };
  } catch (e) {
    return defaultConfig;
  }
}
//# sourceMappingURL=read-config.js.map