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
const createAttribute = exports.createAttribute = ({
  name,
  value,
  valuePath,
  valueNode,
  isBoolean = false,
  isNode = false,
  isString = false
}) => ({
  type: attributeName,
  name,
  value,
  valuePath,
  valueNode,
  isBoolean,
  isString,
  isNode
});

// Template engine syntax for inline JavaScript.
// export const scriptletName = 'Scriptlet';
// export const createScriptlet = value => ({
//   type: scriptletName,
//   value
// });

// Template engine syntax for escaped interpolation.
const interpolationEscapedName = exports.interpolationEscapedName = 'InterpolationEscaped';
const createInterpolationEscaped = exports.createInterpolationEscaped = valuePath => ({
  type: interpolationEscapedName,
  valuePath
});

// Template engine syntax for unescaped interpolation.
const interpolationUnescapedName = exports.interpolationUnescapedName = 'InterpolationUnescaped';
const createInterpolationUnescaped = exports.createInterpolationUnescaped = valuePath => ({
  type: interpolationUnescapedName,
  valuePath
});

// Template engine syntax for condition.
const conditionName = exports.conditionName = 'Condition';
const createCondition = exports.createCondition = ({ testPath, consequent, alternate = null }) => ({
  type: conditionName,
  testPath,
  consequent,
  alternate
});

// Template engine syntax for iteration.
const iterationName = exports.iterationName = 'Iteration';
const createIteration = exports.createIteration = ({
  iterablePath,
  currentValuePath,
  indexPath,
  arrayPath,
  body = null
}) => ({
  type: iterationName,
  iterablePath,
  currentValuePath,
  indexPath,
  arrayPath,
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