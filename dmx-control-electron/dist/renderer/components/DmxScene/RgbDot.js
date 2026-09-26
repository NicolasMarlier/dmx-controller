"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./RgbDot.scss");
const RgbDot = (props) => {
    const { red, green, blue, selected, onClick } = props;
    return (0, jsx_runtime_1.jsx)("div", { className: `rgb-dot ${selected ? 'selected' : ''}`, onClick: () => onClick(), children: (0, jsx_runtime_1.jsx)("div", { className: 'content', style: { background: `rgb(${red}, ${green}, ${blue})` } }) });
};
exports.default = RgbDot;
//# sourceMappingURL=RgbDot.js.map