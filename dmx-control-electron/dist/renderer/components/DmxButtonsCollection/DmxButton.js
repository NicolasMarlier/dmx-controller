"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const utils_1 = require("../../utils");
require("./DmxButton.scss");
const DmxButton = (props) => {
    const { onTap, selected, isPlaying, dmxButton: dmxButton } = props;
    const { ledBarConfigs } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const isLighted = (dmxButton, ledBarConfig) => (dmxButton.red_channels.some(c => c >= ledBarConfig.channel && c < ledBarConfig.channel + ledBarConfig.rgbDotsCount * 3));
    const global = dmxButton.program_id == null;
    return (0, jsx_runtime_1.jsxs)("div", { className: `dmx-button ${isPlaying ? 'playing' : ''} ${selected ? 'selected' : ''} ${global ? 'global' : ''}`, onClick: onTap, children: [(0, jsx_runtime_1.jsx)("div", { className: "playing-light" }), dmxButton.triggering_midi_key && (0, jsx_runtime_1.jsx)("div", { className: "triggering-midi-key", children: (0, utils_1.humanizeMidiKey)(dmxButton.triggering_midi_key) }), (0, jsx_runtime_1.jsx)("div", { className: 'color-symbols', children: ledBarConfigs.map(ledBarConfig => ((0, jsx_runtime_1.jsx)("div", { className: 'color-symbol', style: isLighted(dmxButton, ledBarConfig) ? { background: dmxButton.color } : {} }))) })] });
};
exports.default = DmxButton;
//# sourceMappingURL=DmxButton.js.map