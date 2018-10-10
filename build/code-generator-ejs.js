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

var _getFirstMemberExpression = require('./utils/get-first-member-expression');

var _getFirstMemberExpression2 = _interopRequireDefault(_getFirstMemberExpression);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* eslint-disable no-param-reassign */
function codeGeneratorEjs(node, { initialIndentLevel = 0, indentLevel = initialIndentLevel, scope = [] } = {}) {
  switch (node.type) {
    case _ast.rootName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel, scope })).join('');
    case _ast.mixinName:
      return node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel, scope })).join('');
    case _ast.elementName:
      return indent(generateTag(node.tagName, node.children.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel: indentLevel + 1, scope })).join(''), node.attributes.map(child => codeGeneratorEjs(child, { initialIndentLevel, indentLevel: indentLevel + 1, scope })).join('')), {
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
        valuePath: node.valuePath,
        isRequired: node.isRequired,
        scope
      });
    case _ast.interpolationEscapedName:
      return generateInterpolation('escaped', node.valuePath, scope);
    case _ast.interpolationUnescapedName:
      return generateInterpolation('unescaped', node.valuePath, scope);
    case _ast.conditionName:
      return indent(generateCondition(node.testPath, codeGeneratorEjs(node.consequent, {
        initialIndentLevel,
        indentLevel: indentLevel + 1,
        scope
      }), node.alternate && codeGeneratorEjs(node.alternate, {
        initialIndentLevel,
        indentLevel: indentLevel + 1,
        scope
      }), scope), {
        initialIndentLevel,
        indentLevel
      });
    case _ast.iterationName:
      {
        const params = getIterationParams(node.currentValuePath, node.indexPath, node.arrayPath);
        return indent(generateIteration({
          iterablePath: node.iterablePath,
          params,
          body: codeGeneratorEjs(node.body, {
            initialIndentLevel,
            indentLevel: indentLevel + 1,
            scope: scope.concat(params)
          }),
          scope
        }), {
          initialIndentLevel,
          indentLevel
        });
      }
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

function generateProperty({ name, isBoolean, isString, value, valuePath, isRequired, scope }) {
  const normalizedName = (0, _normalizePropertyName2.default)(name);
  const startPropertyBeginning = ` ${normalizedName}`;

  if (isBoolean) {
    return startPropertyBeginning;
  }

  if (isString) {
    return `${startPropertyBeginning}="${value}"`;
  }

  makeReferenceSafe(valuePath, scope);
  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  const resultString = resolvesToString(valuePath);
  const propertyInterpolated = `${startPropertyBeginning}="${generateInterpolation('escaped', valuePath, scope)}"`;
  if (!resultString && !isRequired) {
    return `${generateScriptlet(`if (![null,undefined].includes(${generatedValue.code})) {`)}${propertyInterpolated}${generateScriptlet('}')}`;
  }
  return propertyInterpolated;
}

function generateCondition(testPath, consequent, alternate, scope) {
  makeReferenceSafe(testPath, scope);
  const generatedValue = (0, _generator2.default)(testPath.node, { concise: true });
  const conditionArray = [generateScriptlet(`if (${generatedValue.code}) {`), consequent, alternate ? generateScriptlet('} else {') : null, alternate, generateScriptlet('}')].filter(Boolean);
  return conditionArray.join('');
}

function generateIteration({ iterablePath, params, body, scope }) {
  const iterationScope = getIterationScope(iterablePath, scope);
  makeReferenceSafe(iterablePath, iterationScope);
  const addParenthesis = t.isLogicalExpression(iterablePath.node);
  const iterableCode = (0, _generator2.default)(iterablePath.node, { concise: true }).code;
  const paramsCode = params.join(', ');
  const iterationArray = [generateScriptlet(`${addParenthesis ? `(${iterableCode})` : iterableCode}.forEach((${paramsCode}) => {`), body, generateScriptlet('})')].filter(Boolean);
  return iterationArray.join('');
}

function getIterationParams(currentValuePath, indexPath, arrayPath) {
  const currentValueCode = currentValuePath ? (0, _generator2.default)(currentValuePath.node, { concise: true }).code : null;
  const indexCode = indexPath ? (0, _generator2.default)(indexPath.node, { concise: true }).code : null;
  const arrayCode = arrayPath ? (0, _generator2.default)(arrayPath.node, { concise: true }).code : null;
  const params = [currentValueCode, indexCode, arrayCode].filter(Boolean);
  return params;
}

function getIterationScope(iterablePath, scope) {
  const iterationScope = [];
  iterablePath.traverse({
    ArrowFunctionExpression(path) {
      path.node.params.forEach(param => iterationScope.push(param.name));
    }
  });

  return iterationScope.concat(scope);
}

function generateScriptlet(value) {
  return `<% ${value} %>`;
}

function generateInterpolation(type, valuePath, scope) {
  makeReferenceSafe(valuePath, scope);
  const generatedValue = (0, _generator2.default)(valuePath.node, { concise: true });
  if (type === 'unescaped') {
    return `<%- ${generatedValue.code} %>`;
  }
  return `<%= ${generatedValue.code} %>`;
}

function makeReferenceSafe(path, scope) {
  if (t.isIdentifier(path)) {
    referenceSafeReplacement(scope, path);
    return;
  }

  if (t.isMemberExpression(path)) {
    const pathFirst = (0, _getFirstMemberExpression2.default)(path);
    if (pathFirst.node.name === 'locals') {
      return;
    }
    referenceSafeReplacement(scope, pathFirst);
  }

  path.traverse({
    Identifier(path1) {
      if (t.isMemberExpression(path1.parent) || t.isObjectProperty(path1.parent)) {
        return;
      }
      referenceSafeReplacement(scope, path1);
    },
    MemberExpression(path1) {
      if (t.isMemberExpression(path1.parent)) {
        return;
      }
      const pathFirst = (0, _getFirstMemberExpression2.default)(path1);
      if (!t.isIdentifier(pathFirst)) {
        return;
      }
      if (pathFirst.node.name === 'locals') {
        return;
      }
      referenceSafeReplacement(scope, pathFirst);
    }
  });
}

function referenceSafeReplacement(scope, path) {
  const isFromScope = !!scope.find(scopeVar => scopeVar === path.node.name);
  const isUndefined = path.node.name === 'undefined';
  if (isFromScope || isUndefined) {
    return;
  }
  path.replaceWith(t.memberExpression(t.identifier('locals'), path.node));
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
  if (t.isLogicalExpression(path.node) && path.node.operator === '||' && t.isStringLiteral(path.node.right)) {
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