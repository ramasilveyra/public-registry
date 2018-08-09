'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = traverser;

var _ast = require('./ast');

function traverser(ast, visitor) {
  function traverseArray(array, parent) {
    array.forEach(child => {
      traverseNode(child, parent);
    });
  }

  function traverseNode(node, parent) {
    const method = visitor[node.type];

    node._parent = parent;

    if (method && method.enter) {
      method.enter(node, parent);
    }

    switch (node.type) {
      case _ast.rootName:
      case _ast.mixinName:
        traverseArray(node.children, node);
        break;
      case _ast.elementName:
        traverseArray(node.children, node);
        traverseArray(node.attributes, node);
        break;
      case _ast.conditionName:
        traverseNode(node.consequent, node);
        if (node.alternate) {
          traverseNode(node.alternate, node);
        }
        break;
      case _ast.iterationName:
        traverseNode(node.body, node);
        break;
      case _ast.attributeName:
        if (node.isNode && node.valueNode) {
          traverseNode(node.valueNode, node);
        }
        break;
      case _ast.textName:
      case _ast.interpolationEscapedName:
        break;
      default:
        throw new TypeError(node.type);
    }

    if (method && method.exit) {
      method.exit(node, parent);
    }
  }

  traverseNode(ast, null);
} /* eslint-disable no-param-reassign, no-underscore-dangle */
//# sourceMappingURL=traverser.js.map