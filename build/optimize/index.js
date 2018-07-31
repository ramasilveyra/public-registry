'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = optimize;

var _htmlTags = require('html-tags');

var _htmlTags2 = _interopRequireDefault(_htmlTags);

var _lodash = require('lodash');

var _lodash2 = _interopRequireDefault(_lodash);

var _traverser = require('../traverser');

var _traverser2 = _interopRequireDefault(_traverser);

var _createInliningVisitor = require('./create-inlining-visitor');

var _createInliningVisitor2 = _interopRequireDefault(_createInliningVisitor);

var _deadCodeEliminationVisitor = require('./dead-code-elimination-visitor');

var _deadCodeEliminationVisitor2 = _interopRequireDefault(_deadCodeEliminationVisitor);

var _setIsRequiredFlagVisitor = require('./set-is-required-flag-visitor');

var _setIsRequiredFlagVisitor2 = _interopRequireDefault(_setIsRequiredFlagVisitor);

var _mergeVisitors = require('./merge-visitors');

var _mergeVisitors2 = _interopRequireDefault(_mergeVisitors);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function optimize(ast, table) {
  (0, _traverser2.default)(ast, (0, _mergeVisitors2.default)(createMainVisitor(table), _deadCodeEliminationVisitor2.default));
  return ast;
} /* eslint-disable no-param-reassign */


function createMainVisitor(table) {
  return {
    Mixin: {
      exit(node) {
        const tableRC = getTableComponent(node.name, table);
        (0, _traverser2.default)(node, (0, _setIsRequiredFlagVisitor2.default)(tableRC.definitions));
      }
    },
    Element: {
      exit(node) {
        const name = node.tagName;
        const isRC = !_htmlTags2.default.includes(name);
        const tableRC = getTableComponent(name, table);
        if (isRC && tableRC) {
          // Generate collection of props name and value.
          const propsToInline = tableRC.node.props && tableRC.node.props.map(prop => {
            const definition = tableRC.definitions && tableRC.definitions.find(def => def.name === prop);
            if (prop === 'children' && node.children) {
              return { name: prop, value: node.children, definition };
            }
            return {
              name: prop,
              value: node.attributes.find(attr => attr.name === prop),
              definition
            };
          });
          // Clone Mixin.
          const componentNode = _lodash2.default.merge({}, tableRC.node);
          // Convert Element in Mixin.
          Object.assign(node, componentNode);
          delete node.tagName;
          delete node.attributes;
          // Inline props.
          if (propsToInline) {
            inlinepProps(node, propsToInline);
          }
          // Check again if new Mixin has React Components.
          optimize(node, table);
        }
      }
    }
  };
}

function getTableComponent(name, table) {
  if (table.components[name]) {
    return table.components[name];
  }
  const tableDep = table.dependencies[name];
  if (tableDep) {
    const component = Object.values(table.components).find(rc => rc.createdFrom === tableDep.path && rc.defaultExport);
    return component;
  }
  return null;
}

function inlinepProps(ast, props) {
  (0, _traverser2.default)(ast, (0, _mergeVisitors2.default)((0, _createInliningVisitor2.default)(props), _deadCodeEliminationVisitor2.default));
}
//# sourceMappingURL=index.js.map