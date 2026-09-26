"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const utils_1 = require("../../utils");
const TriggeringMidiKeySelect = (props) => {
    const { value, onChange } = props;
    const { lastReceivedMidiKey } = (0, RealTimeContext_1.useRealTimeContext)();
    return (0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [!value && !lastReceivedMidiKey && (0, jsx_runtime_1.jsx)("input", { value: 'No signal', disabled: true }), !value && !!lastReceivedMidiKey && (0, jsx_runtime_1.jsx)("div", { className: "attaching-signal", onClick: () => onChange(lastReceivedMidiKey.midi), children: (0, jsx_runtime_1.jsxs)("span", { className: "btn", children: ["Attach ", (0, utils_1.humanizeMidiKey)(lastReceivedMidiKey.midi), " "] }) }), value && (0, jsx_runtime_1.jsxs)("div", { className: "bound-signal", children: [(0, jsx_runtime_1.jsx)("input", { value: (0, utils_1.humanizeMidiKey)(value), disabled: true }), (0, jsx_runtime_1.jsx)("div", { className: "unbind-btn", title: "Unbind", onClick: () => onChange(null), children: "\u00D7" })] })] });
};
exports.default = TriggeringMidiKeySelect;
//# sourceMappingURL=TriggeringMidiKeySelect.js.map