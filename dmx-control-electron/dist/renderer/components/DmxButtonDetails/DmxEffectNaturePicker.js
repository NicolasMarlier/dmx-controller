"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DmxEffectNaturePicker = (props) => {
    const { value, onChange } = props;
    const DmxEffectNatures = ['Boom', 'Set', 'Run', 'InverseRun', 'Toggle'];
    return (0, jsx_runtime_1.jsx)("select", { value: value, onChange: (e) => {
            const newNature = (DmxEffectNatures.find(n => n == e.target.value) || 'Set');
            onChange(newNature);
        }, children: DmxEffectNatures.map((nature) => ((0, jsx_runtime_1.jsx)("option", { children: nature }, nature))) });
};
exports.default = DmxEffectNaturePicker;
//# sourceMappingURL=DmxEffectNaturePicker.js.map