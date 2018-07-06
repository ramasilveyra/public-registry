'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _void = require('html-tags/void');

var _void2 = _interopRequireDefault(_void);

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _ast = require('./ast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function codeGeneratorEjs(node, { initialIndentLevel = 0, indentLevel = initialIndentLevel } = {}) {
  switch (node.type) {
    case _ast.rootName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel })).join('');
    case _ast.mixinName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel }));
    case _ast.elementName:
      return indent(generateTag(node.tagName, node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel: indentLevel + 1 })).join(''), node.attributes.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel: indentLevel + 1 })).join('')), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.textName:
      return node.value;
    case _ast.attributeName:
      return generateProperty(node.name, node.value, node.expression);
    case _ast.interpolationEscapedName:
      return generateInterpolationEscaped(node.value);
    case _ast.conditionName:
      return indent(generateCondition(node.test, codeGeneratorEjs(node.consequent, { initialIndentLevel, indentLevel: indentLevel + 1 }), node.alternate && codeGeneratorEjs(node.alternate, { initialIndentLevel, indentLevel: indentLevel + 1 })), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.iterationName:
      return indent(generateIteration({
        iterable: node.iterable,
        currentValue: node.currentValue,
        index: node.index,
        array: node.array,
        body: codeGeneratorEjs(node.body, { initialIndentLevel, indentLevel: indentLevel + 1 })
      }), {
        initialIndentLevel,
        indentLevel
      });
    default:
      throw new TypeError(node.type);
  }
}

exports.default = codeGeneratorEjs;


function generateTag(tagName, children, properties) {
  const startTagBeginning = `<${tagName}${properties}`;
  if (_void2.default.includes(tagName)) {
    return `${startTagBeginning} />`;
  }
  const startTag = `${startTagBeginning}>`;
  const endTag = `</${tagName}>`;
  const tag = startTag + children + endTag;

  return tag;
}

function generateProperty(name, value, expression) {
  const normalizedName = normalizePropertyName(name);
  const startPropertyBeginning = ` ${normalizedName}`;

  // NOTE: `value === true` is to accept boolean attributes, e.g.: `<input checked />`.
  if (value === true) {
    return startPropertyBeginning;
  }

  if (expression) {
    const result = isNullOrUndefined(value);
    const propertyInterpolated = `${startPropertyBeginning}="${generateInterpolationEscaped(value)}"`;
    if (result) {
      return `${generateScriptlet(`if (![null,undefined].includes(${value})) {`)}${propertyInterpolated}${generateScriptlet('}')}`;
    }
    return propertyInterpolated;
  }

  return `${startPropertyBeginning}="${value}"`;
}

function normalizePropertyName(name) {
  switch (name) {
    case 'className':
      return 'class';
    case 'htmlFor':
      return 'for';
    case 'tabIndex':
      return 'tabindex';
    default:
      return name;
  }
}

function generateCondition(test, consequent, alternate) {
  const conditionArray = [generateScriptlet(`if (${test}) {`), consequent, alternate ? generateScriptlet('} else {') : null, alternate, generateScriptlet('}')].filter(Boolean);
  return conditionArray.join('');
}

function generateIteration({ iterable, currentValue, index, array, body }) {
  const params = [currentValue, index, array].filter(Boolean).join(', ');
  const iterationArray = [generateScriptlet(`${iterable}.forEach((${params}) => {`), body, generateScriptlet('})')].filter(Boolean);
  return iterationArray.join('');
}

function generateScriptlet(value) {
  return `<% ${value} %>`;
}

function generateInterpolationEscaped(value) {
  return `<%= ${value} %>`;
}

function indent(str, { initialIndentLevel, indentLevel }) {
  const indentChar = ' ';
  const indentLength = 2;
  const startIndentNumber = indentLevel * indentLength;
  const endIndentNumber = (indentLevel ? indentLevel - 1 : indentLevel) * indentLength;
  const strIndented = `${indentLevel === initialIndentLevel ? '' : '\n'}${indentChar.repeat(startIndentNumber)}${str}${'\n'}${indentChar.repeat(endIndentNumber)}`;
  return strIndented;
}

function isNullOrUndefined(code) {
  let evaluates = null;
  (0, _traverse2.default)((0, _parser2.default)(`(${code})`), {
    Program(path) {
      const body = path.get('body');
      if (!body) {
        return;
      }
      const bodyChild = body[0];
      if (!bodyChild) {
        return;
      }
      evaluates = bodyChild.evaluate();
    }
  }, null);
  if (evaluates.confident) {
    const result = [null, undefined].includes(evaluates.value);
    return result;
  }
  return true;
}
//# sourceMappingURL=code-generator-ejs.js.map