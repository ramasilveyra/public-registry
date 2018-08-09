'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = addToContext;

var _ast = require('../ast');

function addToContext(context, node, member) {
  if (member) {
    addNode(context, node, member);
    return;
  }
  switch (context.type) {
    case _ast.rootName:
    case _ast.elementName:
    case _ast.mixinName:
      addNode(context, node, 'children');
      break;
    case _ast.iterationName:
      addNode(context, node, 'body');
      break;
    case _ast.conditionName:
      if (context.consequent) {
        addNode(context, node, 'alternate');
      } else {
        addNode(context, node, 'consequent');
      }
      break;
    case _ast.attributeName:
      addNode(context, node, 'valueNode');
      break;
    default:
      throw new Error(`Don't know how to add node to ${context.type}`);
  }
} /* eslint-disable no-param-reassign */


function addNode(context, node, member) {
  if (Array.isArray(context[member])) {
    context[member].push(node);
    return;
  }
  context[member] = node;
}
//# sourceMappingURL=add-to-context.js.map