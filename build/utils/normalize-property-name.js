'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
function normalizePropertyName(name) {
  switch (name) {
    case 'className':
      return 'class';
    case 'htmlFor':
      return 'for';
    case 'tabIndex':
      return 'tabindex';
    case 'defaultValue':
      return 'value';
    case 'readOnly':
      return 'readonly';
    default:
      return name;
  }
}

exports.default = normalizePropertyName;
//# sourceMappingURL=normalize-property-name.js.map