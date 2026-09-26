"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
require("./DmxButtonDetails.scss");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const DmxButtonDetailsPlaceholder_1 = __importDefault(require("./DmxButtonDetailsPlaceholder"));
const DmxEffectNaturePicker_1 = __importDefault(require("./DmxEffectNaturePicker"));
const TriggeringMidiKeySelect_1 = __importDefault(require("./TriggeringMidiKeySelect"));
const DmxButtonDetails = () => {
    const { dmxButtons, selectedDmxButtonId, updateDmxButtonAndSync, deleteDmxButtonAndSync, currentProgramId } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const dmxButton = dmxButtons.find(({ id }) => id == selectedDmxButtonId);
    if (!dmxButton)
        return (0, jsx_runtime_1.jsx)(DmxButtonDetailsPlaceholder_1.default, {});
    const [nature, setNature] = (0, react_1.useState)(dmxButton.nature);
    const [durationMs, setDurationMs] = (0, react_1.useState)(dmxButton.duration_ms);
    const [color, setColor] = (0, react_1.useState)(dmxButton.color);
    const [triggeringMidiKey, setTriggeringMidiKey] = (0, react_1.useState)(dmxButton.triggering_midi_key);
    const [programId, setProgramId] = (0, react_1.useState)(dmxButton.program_id);
    (0, react_1.useEffect)(() => {
        setNature(dmxButton.nature);
        setDurationMs(dmxButton.duration_ms);
        setColor(dmxButton.color);
        setTriggeringMidiKey(dmxButton.triggering_midi_key);
        setProgramId(dmxButton.program_id);
    }, [dmxButton]);
    (0, react_1.useEffect)(() => {
        updateDmxButtonAndSync(dmxButton.id, {
            color,
            duration_ms: durationMs,
            nature,
            triggering_midi_key: triggeringMidiKey,
            program_id: programId,
        });
    }, [color, durationMs, nature, triggeringMidiKey, programId]);
    return (0, jsx_runtime_1.jsxs)("div", { className: "dmx-button-details", children: [(0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Function" }), (0, jsx_runtime_1.jsx)(DmxEffectNaturePicker_1.default, { value: nature, onChange: setNature })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Color" }), (0, jsx_runtime_1.jsx)("label", { className: "color", style: { background: color }, children: (0, jsx_runtime_1.jsx)("input", { name: "color", value: color, type: "color", onChange: (e) => { setColor(e.target.value); } }) })] }), (0, jsx_runtime_1.jsxs)("div", { children: [(0, jsx_runtime_1.jsx)("label", { children: "Duration" }), (0, jsx_runtime_1.jsx)("input", { name: "durationMs", value: durationMs, onChange: (e) => { setDurationMs(parseInt(e.target.value, 10)); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "", children: [(0, jsx_runtime_1.jsx)("label", { children: "Global" }), (0, jsx_runtime_1.jsx)("input", { name: "global", type: "checkbox", checked: programId == null, onChange: (e) => { setProgramId(e.target.checked ? null : (currentProgramId || null)); } })] }), (0, jsx_runtime_1.jsxs)("div", { className: "", children: [(0, jsx_runtime_1.jsx)("label", { children: "Signal" }), (0, jsx_runtime_1.jsx)(TriggeringMidiKeySelect_1.default, { value: triggeringMidiKey, onChange: setTriggeringMidiKey })] }), (0, jsx_runtime_1.jsx)("div", { className: "delete-btn btn", onClick: () => deleteDmxButtonAndSync(dmxButton.id), children: "DELETE" })] });
};
exports.default = DmxButtonDetails;
//# sourceMappingURL=DmxButtonDetails.js.map