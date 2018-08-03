'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _parser = require('@babel/parser');

function parser(code) {
  const ast = (0, _parser.parse)(code, {
    sourceType: 'module',
    plugins: ['jsx']
  });

  return ast;
}

exports.default = parser;
//# sourceMappingURL=parser.js.map