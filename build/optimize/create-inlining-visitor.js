'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

var _traverse = require('@babel/traverse');

var _traverse2 = _interopRequireDefault(_traverse);

var _generator = require('@babel/generator');

var _generator2 = _interopRequireDefault(_generator);

var _ast = require('../ast');

var _parser = require('../parser');

var _parser2 = _interopRequireDefault(_parser);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function createInliningVisitor(props) {
  return {
    Attribute: {
      exit(node, parent) {
        inlineNodeVisitor(node, parent, props, 'valuePath');
      }
    },
    InterpolationEscaped: {
      exit(node, parent) {
        inlineNodeVisitor(node, parent, props, 'valuePath');
      }
    },
    Iteration: {
      exit(node, parent) {
        inlineNodeVisitor(node, parent, props, 'iterablePath');
      }
    },
    Condition: {
      enter(node, parent) {
        inlineNodeVisitor(node, parent, props, 'testPath');
      }
    }
  };
} /* eslint-disable no-param-reassign, no-underscore-dangle */
exports.default = createInliningVisitor;


function inlineNodeVisitor(node, parent, props, key) {
  if (!node[key]) {
    return;
  }
  node[key] = clonePath(node[key].node);
  if (t.isIdentifier(node[key].node) && !t.isMemberExpression(node[key].parent)) {
    inline(props, node[key], parent);
    return;
  }
  node[key].traverse({
    Identifier(path) {
      if (t.isMemberExpression(path.parent)) {
        return;
      }
      inline(props, path, parent);
    }
  });
}

function inline(props, path, parent) {
  const iteration = findParent(parent, node => node.type === _ast.iterationName);
  const matchedProp = props.find(prop => prop.name === path.node.name);
  if (iteration && iteration.currentValuePath.node.name === path.node.name) {
    return;
  }
  if (!matchedProp || !matchedProp.value) {
    path.node.name = 'undefined';
    return;
  }
  if (matchedProp.value.isBoolean) {
    path.replaceWith(t.BooleanLiteral(true));
    return;
  }
  if (matchedProp.value.isString) {
    path.replaceWith(t.stringLiteral(matchedProp.value.value));
    return;
  }
  if (matchedProp.name === 'children') {
    const position = parent.children.findIndex(child => {
      if (child.valuePath) {
        return t.isIdentifier(child.valuePath.node, { name: 'children' });
      }
      return false;
    });
    parent.children = [...parent.children.slice(0, position), ...matchedProp.value, ...parent.children.slice(position + 1)];
    return;
  }
  const matchedPropNode = matchedProp.value.valuePath.node;
  if (t.isIdentifier(matchedPropNode)) {
    path.node.name = matchedPropNode.name;
    return;
  }
  path.replaceWith(matchedPropNode);
}

function findParent(node, condition) {
  let target = node;
  while (target._parent) {
    if (condition(target)) {
      return target;
    }
    target = target._parent;
  }
  return null;
}

function clonePath(node) {
  const code = (0, _generator2.default)(node).code;
  const ast = (0, _parser2.default)(code);
  let newPath = null;
  (0, _traverse2.default)(ast, {
    Program(path) {
      newPath = path.get('body.0');
      if (t.isExpressionStatement(newPath.node)) {
        newPath = newPath.get('expression');
      }
    }
  }, null);
  return newPath;
}
//# sourceMappingURL=create-inlining-visitor.js.map