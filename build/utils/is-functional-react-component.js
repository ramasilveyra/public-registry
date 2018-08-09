'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = isFunctionalReactComponent;

var _types = require('@babel/types');

var t = _interopRequireWildcard(_types);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

// Note: this makes a lot of assumptions based on common conventions, it's not accurate.
function isFunctionalReactComponent(path) {
  const node = path.node;
  const isVariableDeclaration = t.isVariableDeclaration(node);
  const isFunctionDeclaration = t.isFunctionDeclaration(node);
  if (!isVariableDeclaration && !isFunctionDeclaration) {
    return false;
  }
  if (isJSXElementOrReactCreateElement(path)) {
    return true;
  }
  return false;
}

function isJSXElementOrReactCreateElement(path) {
  let visited = false;

  path.traverse({
    JSXElement() {
      visited = true;
    }
  });

  return visited;
}
//# sourceMappingURL=is-functional-react-component.js.map