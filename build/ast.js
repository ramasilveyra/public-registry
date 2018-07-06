'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
// Root.
const rootName = exports.rootName = 'Program';
const createRoot = exports.createRoot = () => ({
  type: rootName,
  children: []
});

// HTML elements.
const elementName = exports.elementName = 'Element';
const createElement = exports.createElement = (tagName, attributes = []) => ({
  type: elementName,
  tagName,
  attributes,
  children: []
});

// HTML text elements.
const textName = exports.textName = 'Text';
const createText = exports.createText = value => ({
  type: textName,
  value
});

// HTML attributes.
const attributeName = exports.attributeName = 'Attribute';
const createAttribute = exports.createAttribute = ({ name, value, expression = false, identifiers }) => ({
  type: attributeName,
  name,
  value,
  expression,
  identifiers
});

// Template engine syntax for inline JavaScript.
// export const scriptletName = 'Scriptlet';
// export const createScriptlet = value => ({
//   type: scriptletName,
//   value
// });

// Template engine syntax for escaped interpolation.
const interpolationEscapedName = exports.interpolationEscapedName = 'InterpolationEscaped';
const createInterpolationEscaped = exports.createInterpolationEscaped = (value, identifiers) => ({
  type: interpolationEscapedName,
  value,
  identifiers
});

// Template engine syntax for unescaped interpolation.
// export const interpolationUnescapedName = 'InterpolationUnescaped';
// export const createInterpolationUnescaped = value => ({
//   type: interpolationUnescapedName,
//   value
// });

// Template engine syntax for condition.
const conditionName = exports.conditionName = 'Condition';
const createCondition = exports.createCondition = ({ test, consequent, alternate = null, identifiers }) => ({
  type: conditionName,
  test,
  consequent,
  alternate,
  identifiers
});

// Template engine syntax for iteration.
const iterationName = exports.iterationName = 'Iteration';
const createIteration = exports.createIteration = ({ iterable, currentValue, index, array, body = null }) => ({
  type: iterationName,
  iterable,
  currentValue,
  index,
  array,
  body
});

// Template engine syntax for mixin.
const mixinName = exports.mixinName = 'Mixin';
const createMixin = exports.createMixin = (name, props) => ({
  type: mixinName,
  name,
  props,
  children: []
});
//# sourceMappingURL=ast.js.map