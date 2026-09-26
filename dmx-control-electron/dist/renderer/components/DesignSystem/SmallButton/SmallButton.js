"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./SmallButton.scss");
const SmallButton = (props) => {
    const { value, onClick, children, disabled, className } = props;
    return (0, jsx_runtime_1.jsx)("div", { className: `small-button ${value ? 'active' : ''} ${disabled ? 'disabled' : 'enabled'} ${className}`, onClick: !disabled && onClick || (() => { }), children: children });
};
exports.default = SmallButton;
//# sourceMappingURL=SmallButton.js.map