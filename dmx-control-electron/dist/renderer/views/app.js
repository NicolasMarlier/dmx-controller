"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("react");
const DmxButtonsContext_1 = require("../contexts/DmxButtonsContext");
const App = () => {
    const { programs } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsx)("p", { children: "YO, sup?" }), programs.map((program) => (0, jsx_runtime_1.jsx)("li", { children: program.name }, program.id))] });
};
exports.default = App;
//# sourceMappingURL=app.js.map