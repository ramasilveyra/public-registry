'use strict';

var Stylis = require('stylis');
var stylisRuleSheet = require('stylis-rule-sheet');

var stylis = new Stylis();

var generator = void 0;
var filename = void 0;
var offset = void 0;

function sourceMapsPlugin() {
  for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }

  var context = args[0],
      line = args[4],
      column = args[5],
      length = args[6];

  // Pre-processed, init source map

  if (context === -1 && generator !== undefined) {
    generator.addMapping({
      generated: {
        line: 1,
        column: 0
      },
      source: filename,
      original: offset
    });

    return;
  }

  // Post-processed
  if (context === -2 && generator !== undefined) {
    generator = undefined;
    offset = undefined;
    filename = undefined;

    return;
  }

  // Selector/property, update source map
  if ((context === 1 || context === 2) && generator !== undefined) {
    generator.addMapping({
      generated: {
        line: 1,
        column: length
      },
      source: filename,
      original: {
        line: line + offset.line,
        column: column + offset.column
      }
    });
  }
}

/**
 * splitRulesPlugin
 * Used to split a blob of css into an array of rules
 * that can inserted via sheet.insertRule
 */
var splitRules = [];

var splitRulesPlugin = stylisRuleSheet(function (rule) {
  splitRules.push(rule);
});

stylis.use(sourceMapsPlugin);
stylis.use(splitRulesPlugin);
stylis.set({
  cascade: false,
  compress: true
});

/**
 * Public transform function
 *
 * @param {String} hash
 * @param {String} styles
 * @param {Object} settings
 * @return {string}
 */
function transform(hash, styles) {
  var settings = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

  generator = settings.generator;
  offset = settings.offset;
  filename = settings.filename;
  splitRules = [];

  stylis.set({
    prefix: typeof settings.vendorPrefixes === 'boolean' ? settings.vendorPrefixes : true
  });

  stylis(hash, styles);

  if (settings.splitRules) {
    return splitRules;
  }

  return splitRules.join('');
}

module.exports = transform;