'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _void = require('html-tags/void');

var _void2 = _interopRequireDefault(_void);

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _generator = require('@babel/generator');

var _generator2 = _interopRequireDefault(_generator);

var _ast = require('./ast');

var _normalizePropertyName = require('./utils/normalize-property-name');

var _normalizePropertyName2 = _interopRequireDefault(_normalizePropertyName);

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
      return generateProperty({
        name: node.name,
        isBoolean: node.isBoolean,
        isString: node.isString,
        value: node.value,
        valuePath: node.valuePath
      });
    case _ast.interpolationEscapedName:
      return generateInterpolationEscaped(node.valuePath);
    case _ast.conditionName:
      return indent(generateCondition(node.testPath, codeGeneratorEjs(node.consequent, { initialIndentLevel, indentLevel: indentLevel + 1 }), node.alternate && codeGeneratorEjs(node.alternate, { initialIndentLevel, indentLevel: indentLevel + 1 })), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.iterationName:
      return indent(generateIteration({
        iterablePath: node.iterablePath,
        currentValuePath: node.currentValuePath,
        indexPath: node.indexPath,
        arrayPath: node.arrayPath,
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

function generateProperty({ name, isBoolean, isString, value, valuePath }) {
  const normalizedName = (0, _normalizePropertyName2.default)(name);
  const startPropertyBeginning = ` ${normalizedName}`;

  if (isBoolean) {
    return startPropertyBeginning;
  }

  if (isString) {
    return `${startPropertyBeginning}="${value}"`;
  }

  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  const resultString = resolvesToString(valuePath);
  const propertyInterpolated = `${startPropertyBeginning}="${generateInterpolationEscaped(valuePath)}"`;
  if (!resultString) {
    return `${generateScriptlet(`if (![null,undefined].includes(${generatedValue.code})) {`)}${propertyInterpolated}${generateScriptlet('}')}`;
  }
  return propertyInterpolated;
}

function generateCondition(testPath, consequent, alternate) {
  const generatedValue = (0, _generator2.default)(testPath.node, { concise: true });
  const conditionArray = [generateScriptlet(`if (${generatedValue.code}) {`), consequent, alternate ? generateScriptlet('} else {') : null, alternate, generateScriptlet('}')].filter(Boolean);
  return conditionArray.join('');
}

function generateIteration({ iterablePath, currentValuePath, indexPath, arrayPath, body }) {
  const iterableCode = (0, _generator2.default)(iterablePath.node, { concise: true }).code;
  const currentValueCode = currentValuePath ? (0, _generator2.default)(currentValuePath.node, { concise: true }).code : null;
  const indexCode = indexPath ? (0, _generator2.default)(indexPath.node, { concise: true }).code : null;
  const arrayCode = arrayPath ? (0, _generator2.default)(arrayPath.node, { concise: true }).code : null;
  const params = [currentValueCode, indexCode, arrayCode].filter(Boolean).join(', ');
  const iterationArray = [generateScriptlet(`${iterableCode}.forEach((${params}) => {`), body, generateScriptlet('})')].filter(Boolean);
  return iterationArray.join('');
}

function generateScriptlet(value) {
  return `<% ${value} %>`;
}

function generateInterpolationEscaped(valuePath) {
  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  return `<%= ${generatedValue.code} %>`;
}

function indent(str, { initialIndentLevel, indentLevel }) {
  const indentChar = ' ';
  const indentLength = 2;
  const startIndentNumber = indentLevel * indentLength;
  const endIndentNumber = (indentLevel ? indentLevel - 1 : indentLevel) * indentLength;
  const strIndented = `${indentLevel === initialIndentLevel ? '' : '\n'}${indentChar.repeat(startIndentNumber)}${str}${'\n'}${indentChar.repeat(endIndentNumber)}`;
  return strIndented;
}

function resolvesToString(path) {
  if (t.isTemplateLiteral(path.node)) {
    return true;
  }
  if (t.isConditionalExpression(path.node) && t.isStringLiteral(path.node.consequent) && t.isStringLiteral(path.node.alternate)) {
    return true;
  }
  if (t.isBinaryExpression(path.node) && path.node.operator === '+') {
    const nodeLeft = path.node.left;
    const nodeRight = path.node.right;
    if (t.isTaggedTemplateExpression(nodeLeft) || t.isStringLiteral(nodeLeft) || t.isTemplateLiteral(nodeLeft) || t.isTaggedTemplateExpression(nodeRight) || t.isStringLiteral(nodeRight) || t.isTemplateLiteral(nodeRight)) {
      return true;
    }
  }
  return false;
}
//# sourceMappingURL=code-generator-ejs.js.map