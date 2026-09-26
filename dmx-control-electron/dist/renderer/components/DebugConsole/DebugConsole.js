"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
require("./DebugConsole.scss");
const DebugConsole = () => {
    const { debugIncomingWsPayloads, debugOutgoingWsPayloads } = (0, RealTimeContext_1.useRealTimeContext)();
    const incomingChannels = [...new Set(debugIncomingWsPayloads.map(({ channel }) => channel))];
    const outgoingChannels = [...new Set(debugOutgoingWsPayloads.map(({ channel }) => channel))];
    const incomingChannelStats = Object.fromEntries(Object.entries(Object.groupBy(debugIncomingWsPayloads, ({ channel }) => channel)).map(([k, v]) => [k, v.length]));
    const outgoingChannelStats = Object.fromEntries(Object.entries(Object.groupBy(debugOutgoingWsPayloads, ({ channel }) => channel)).map(([k, v]) => [k, v.length]));
    const [currentFocus, setCurrentFocus] = (0, react_1.useState)(undefined);
    return (0, jsx_runtime_1.jsxs)("div", { className: 'debug-console', children: [incomingChannels.map(c => (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { onClick: () => setCurrentFocus(`inc-${c}`), children: ["[INC] ", c, " (", incomingChannelStats[c], ")"] }, c), currentFocus == `inc-${c}` && (0, jsx_runtime_1.jsx)("div", { className: 'details', children: debugIncomingWsPayloads.filter(p => p.channel = c).map((p, i) => (0, jsx_runtime_1.jsx)("p", { children: JSON.stringify(p) }, i)) })] })), outgoingChannels.map(c => (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsxs)("p", { onClick: () => setCurrentFocus(`out-${c}`), children: ["[INC] ", c, " (", outgoingChannelStats[c], ")"] }, c), currentFocus == `out-${c}` && (0, jsx_runtime_1.jsx)("div", { className: 'details', children: debugOutgoingWsPayloads.filter(p => p.channel = c).map((p, i) => (0, jsx_runtime_1.jsx)("p", { children: JSON.stringify(p) }, i)) })] }))] });
};
exports.default = DebugConsole;
//# sourceMappingURL=DebugConsole.js.map