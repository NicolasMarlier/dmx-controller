"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./LostConnectionOverlay.scss");
const LostConnectionOverlay = () => {
    return (0, jsx_runtime_1.jsxs)("div", { className: 'overlay', children: [(0, jsx_runtime_1.jsx)("div", { className: 'overlay-title', children: "Connection lost" }), (0, jsx_runtime_1.jsx)("div", { children: "Please restart the server" })] });
};
exports.default = LostConnectionOverlay;
//# sourceMappingURL=LostConnectionOverlay.js.map