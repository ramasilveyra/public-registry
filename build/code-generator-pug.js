'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _void = require('html-tags/void');

var _void2 = _interopRequireDefault(_void);

var _ast = require('./ast');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function codeGeneratorPug(node, { initialIndentLevel = 0, indentLevel = initialIndentLevel, previousSibling = null } = {}) {
  switch (node.type) {
    case _ast.rootName:
      return node.children.map(child => codeGeneratorPug(child, { initialIndentLevel, indentLevel })).join('');
    case _ast.mixinName:
      return node.children.map(child => codeGeneratorPug(child, { initialIndentLevel, indentLevel }));
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
      if (previousSibling && previousSibling.type === _ast.elementName) {
        return indent(`| ${node.value}`, { initialIndentLevel, indentLevel });
      }
      return node.value;
    case _ast.attributeName:
      return generateProperty(node.name, node.value, node.expression);
    case _ast.interpolationEscapedName:
      if (previousSibling && [_ast.elementName, _ast.conditionName].includes(previousSibling.type)) {
        return indent(`| ${generateInterpolationEscaped(node.value)}`, {
          initialIndentLevel,
          indentLevel
        });
      }
      return generateInterpolationEscaped(node.value);
    case _ast.conditionName:
      return indent(generateCondition(node.test, codeGeneratorPug(node.consequent, { initialIndentLevel, indentLevel: indentLevel + 1 }), node.alternate && codeGeneratorPug(node.alternate, { initialIndentLevel, indentLevel: indentLevel + 1 }), initialIndentLevel, indentLevel + 1), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.iterationName:
      return indent(generateIteration({
        iterable: node.iterable,
        currentValue: node.currentValue,
        index: node.index,
        array: node.array,
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

function generateProperty(name, value, expression) {
  const normalizedName = normalizePropertyName(name);

  // NOTE: `value === true` is to accept boolean attributes, e.g.: `<input checked />`.
  if (value === true) {
    return normalizedName;
  }

  if (expression) {
    return `${normalizedName}=${value}`;
  }

  return `${normalizedName}="${value}"`;
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

function generateCondition(test, consequent, alternate, initialIndentLevel, indentLevel) {
  const newConsequent = consequent[0] === '\n' ? consequent : indent(consequent, { initialIndentLevel, indentLevel });
  const alternateOrNull = stuff => alternate ? stuff() : null;
  const conditionArray = [`if ${test}`, newConsequent, alternateOrNull(() => indent('else', { initialIndentLevel, indentLevel: indentLevel - 1 })), alternateOrNull(() => alternate[0] === '\n' ? alternate : indent(alternate, { initialIndentLevel, indentLevel }))].filter(Boolean);
  return conditionArray.join('');
}

function generateIteration({
  iterable,
  currentValue,
  index,
  array,
  body,
  initialIndentLevel,
  indentLevel
}) {
  const params = [currentValue, index].filter(Boolean).join(', ');
  const iterationArray = [`each ${params} in ${iterable}`, array ? indent(generateScriptlet(`const ${array} = ${iterable};`), {
    initialIndentLevel,
    indentLevel: indentLevel + 1
  }) : null, body].filter(Boolean);
  return iterationArray.join('');
}

function generateScriptlet(value) {
  return `- ${value}`;
}

function generateInterpolationEscaped(value) {
  return `#{${value}}`;
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