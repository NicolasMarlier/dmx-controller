"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Toggle.scss");
const Toggle = (props) => {
    const { value, onChange, disabled } = props;
    return (0, jsx_runtime_1.jsx)("div", { className: `toggle ${value ? 'active' : ''} ${disabled ? 'disabled' : 'enabled'}`, onClick: () => !disabled && onChange && onChange(!value), children: (0, jsx_runtime_1.jsx)("div", { className: 'toggle-pin' }) });
};
exports.default = Toggle;
//# sourceMappingURL=Toggle.js.map