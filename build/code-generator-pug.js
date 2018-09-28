'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _void = require('html-tags/void');

var _void2 = _interopRequireDefault(_void);

var _generator = require('@babel/generator');

var _generator2 = _interopRequireDefault(_generator);

var _ast = require('./ast');

var _normalizePropertyName = require('./utils/normalize-property-name');

var _normalizePropertyName2 = _interopRequireDefault(_normalizePropertyName);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function codeGeneratorPug(node, { initialIndentLevel = 0, indentLevel = initialIndentLevel, previousSibling = null } = {}) {
  switch (node.type) {
    case _ast.rootName:
      return node.children.map(child => codeGeneratorPug(child, { initialIndentLevel, indentLevel })).join('');
    case _ast.mixinName:
      return node.children.map(child => codeGeneratorPug(child, { initialIndentLevel, indentLevel })).join('');
    case _ast.elementName:
      return indent(generateTag(node.tagName, node.children.map((child, i) => codeGeneratorPug(child, {
        initialIndentLevel,
        indentLevel: indentLevel + 1,
        previousSibling: i > 0 ? node.children[i - 1] : null
      })).join(''), node.attributes.map(child => codeGeneratorPug(child, { initialIndentLevel, indentLevel: indentLevel + 1 })).join(', ')), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.textName:
      if (previousSibling && previousSibling.type === _ast.conditionName) {
        return indent(`| ${node.value}`, { initialIndentLevel, indentLevel });
      }
      if (previousSibling && previousSibling.type === _ast.elementName) {
        return indent(`| ${node.value}`, { initialIndentLevel, indentLevel });
      }
      if (previousSibling && previousSibling.type === _ast.mixinName) {
        return indent(`| ${node.value}`, { initialIndentLevel, indentLevel });
      }
      return node.value;
    case _ast.attributeName:
      return generateProperty({
        name: node.name,
        isBoolean: node.isBoolean,
        isString: node.isString,
        value: node.value,
        valuePath: node.valuePath
      });
    case _ast.interpolationUnescapedName:
    case _ast.interpolationEscapedName:
      {
        const type = node.type === _ast.interpolationEscapedName ? 'escaped' : 'unescaped';
        if (previousSibling && [_ast.elementName, _ast.conditionName].includes(previousSibling.type)) {
          return indent(`| ${generateInterpolation(type, node.valuePath)}`, {
            initialIndentLevel,
            indentLevel
          });
        }
        return generateInterpolation(type, node.valuePath);
      }
    case _ast.conditionName:
      return indent(generateCondition(node.testPath, codeGeneratorPug(node.consequent, { initialIndentLevel, indentLevel: indentLevel + 1 }), node.alternate && codeGeneratorPug(node.alternate, { initialIndentLevel, indentLevel: indentLevel + 1 }), initialIndentLevel, indentLevel + 1), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.iterationName:
      return indent(generateIteration({
        iterablePath: node.iterablePath,
        currentValuePath: node.currentValuePath,
        indexPath: node.indexPath,
        arrayPath: node.arrayPath,
        body: codeGeneratorPug(node.body, { initialIndentLevel, indentLevel: indentLevel + 1 }),
        initialIndentLevel,
        indentLevel
      }), {
        initialIndentLevel,
        indentLevel
      });
    default:
      throw new TypeError(node.type);
  }
}

exports.default = codeGeneratorPug;


function generateTag(tagName, children, properties) {
  const startTag = `${tagName}${properties ? '(' : ''}${properties}${properties ? ')' : ''}`;
  if (_void2.default.includes(tagName)) {
    return startTag;
  }
  const addSpace = children && !children[0].includes('\n');
  const tag = startTag + (addSpace ? ` ${children}` : children);
  return tag;
}

function generateProperty({ name, isBoolean, isString, value, valuePath }) {
  const normalizedName = (0, _normalizePropertyName2.default)(name);

  if (isBoolean) {
    return normalizedName;
  }

  if (isString) {
    return `${normalizedName}="${value}"`;
  }

  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  return `${normalizedName}=${generatedValue.code}`;
}

function generateCondition(testPath, consequent, alternate, initialIndentLevel, indentLevel) {
  const alternateOrNull = stuff => alternate ? stuff() : null;
  const generatedValue = (0, _generator2.default)(testPath.node, { concise: true });
  const generatedIf = `if ${generatedValue.code}`;
  const generatedConsequent = fixConsequent(consequent, initialIndentLevel, indentLevel);
  const generatedElse = alternateOrNull(() => indent('else', { initialIndentLevel, indentLevel: indentLevel - 1 }));
  const generatedAlternate = alternateOrNull(() => alternate[0] === '\n' ? alternate : indent(alternate, { initialIndentLevel, indentLevel }));
  const conditionArray = [generatedIf, generatedConsequent, generatedElse && generatedElse[0] === 'e' ? `\n${generatedElse}` : generatedElse, generatedAlternate].filter(Boolean);
  return conditionArray.join('');
}

function fixConsequent(consequent, initialIndentLevel, indentLevel) {
  if (consequent[0] === '\n') {
    return consequent;
  }
  if (consequent.startsWith('#{') && consequent.endsWith('}')) {
    return indent(`| ${consequent}`, { initialIndentLevel, indentLevel });
  }
  return indent(consequent, { initialIndentLevel, indentLevel });
}

function generateIteration({
  iterablePath,
  currentValuePath,
  indexPath,
  arrayPath,
  body,
  initialIndentLevel,
  indentLevel
}) {
  const iterableCode = (0, _generator2.default)(iterablePath.node, { concise: true }).code;
  const currentValueCode = currentValuePath ? (0, _generator2.default)(currentValuePath.node, { concise: true }).code : null;
  const indexCode = indexPath ? (0, _generator2.default)(indexPath.node, { concise: true }).code : null;
  const arrayCode = arrayPath ? (0, _generator2.default)(arrayPath.node, { concise: true }).code : null;
  const params = [currentValueCode, indexCode].filter(Boolean).join(', ');
  const iterationArray = [`each ${params} in ${iterableCode}`, arrayCode ? indent(generateScriptlet(`const ${arrayCode} = ${iterableCode};`), {
    initialIndentLevel,
    indentLevel: indentLevel + 1
  }) : null, body].filter(Boolean);
  return iterationArray.join('');
}

function generateScriptlet(value) {
  return `- ${value}`;
}

function generateInterpolation(type, valuePath) {
  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  if (type === 'unescaped') {
    return `!{${generatedValue.code}}`;
  }
  return `#{${generatedValue.code}}`;
}

function indent(str, { initialIndentLevel, indentLevel }) {
  const indentChar = ' ';
  const indentLength = 2;
  const startIndentNumber = indentLevel * indentLength;
  const isRoot = indentLevel === initialIndentLevel;
  const strIndented = `${isRoot ? '' : '\n'}${indentChar.repeat(startIndentNumber)}${str}${isRoot ? '\n' : ''}`;
  return strIndented;
}
//# sourceMappingURL=code-generator-pug.js.map