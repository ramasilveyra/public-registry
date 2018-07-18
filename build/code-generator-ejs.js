'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _void = require('html-tags/void');

var _void2 = _interopRequireDefault(_void);

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _parser = require('./parser');

var _parser2 = _interopRequireDefault(_parser);

var _ast = require('./ast');

var _normalizePropertyName = require('./utils/normalize-property-name');

var _normalizePropertyName2 = _interopRequireDefault(_normalizePropertyName);

var _getBodyChild = require('./utils/get-body-child');

var _getBodyChild2 = _interopRequireDefault(_getBodyChild);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function codeGeneratorEjs(node, { initialIndentLevel = 0, indentLevel = initialIndentLevel } = {}) {
  switch (node.type) {
    case _ast.rootName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel })).join('');
    case _ast.mixinName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel })).join('');
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
} /* eslint-disable no-param-reassign */
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
  const normalizedName = (0, _normalizePropertyName2.default)(name);
  const startPropertyBeginning = ` ${normalizedName}`;

  // NOTE: `value === true` is to accept boolean attributes, e.g.: `<input checked />`.
  if (value === true) {
    return startPropertyBeginning;
  }

  if (expression) {
    // TODO: property nodes that are expressions should have the babel ast so `isNullOrUndefined()` or `isString()` doesn't need to parse again.
    const resultNullOrUndefined = isNullOrUndefined(value);
    const resultString = isString(value);
    const propertyInterpolated = `${startPropertyBeginning}="${generateInterpolationEscaped(value)}"`;
    if (!resultString && resultNullOrUndefined) {
      return `${generateScriptlet(`if (![null,undefined].includes(${value})) {`)}${propertyInterpolated}${generateScriptlet('}')}`;
    }
    return propertyInterpolated;
  }

  return `${startPropertyBeginning}="${value}"`;
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
  const bodyChild = (0, _getBodyChild2.default)(code);
  if (!bodyChild) {
    return true;
  }
  const evaluates = bodyChild.evaluate();
  if (evaluates.confident) {
    const result = [null, undefined].includes(evaluates.value);
    return result;
  }
  return true;
}

function isString(code) {
  const ast = (0, _parser2.default)(`(${code})`);
  let is = false;
  (0, _traverse2.default)(ast, {
    Program(path) {
      const body = path.get('body');
      if (!body) {
        return;
      }
      const bodyChild = body[0];
      if (t.isTemplateLiteral(bodyChild.node.expression)) {
        is = true;
      }
    },
    ConditionalExpression(path) {
      if (t.isStringLiteral(path.node.consequent) && t.isStringLiteral(path.node.alternate)) {
        is = true;
      }
    },
    BinaryExpression(path) {
      if (path.node.operator !== '+') {
        return;
      }
      const nodeLeft = path.node.left;
      const nodeRight = path.node.right;
      if (t.isTaggedTemplateExpression(nodeLeft) || t.isStringLiteral(nodeLeft) || t.isTemplateLiteral(nodeLeft) || t.isTaggedTemplateExpression(nodeRight) || t.isStringLiteral(nodeRight) || t.isTemplateLiteral(nodeRight)) {
        is = true;
      }
    }
  }, null);
  return is;
}
//# sourceMappingURL=code-generator-ejs.js.map