"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./DmxScene.scss");
const LedBar_1 = __importDefault(require("./LedBar"));
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const DmxScene = () => {
    const { dmxButtons, selectedDmxButtonId, ledBarConfigs } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const { dmxHexSignal } = (0, RealTimeContext_1.useRealTimeContext)();
    const { updateDmxButtonAndSync } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const selectedRedChannels = dmxButtons.find(({ id }) => selectedDmxButtonId == id)?.red_channels || [];
    const onSelectRedChannels = (redChannels, selected) => {
        if (!selectedDmxButtonId)
            return;
        if (selected) {
            updateDmxButtonAndSync(selectedDmxButtonId, { red_channels: [...new Set([...selectedRedChannels, ...redChannels])] });
        }
        else {
            updateDmxButtonAndSync(selectedDmxButtonId, { red_channels: selectedRedChannels.filter(channel => redChannels.indexOf(channel) == -1) });
        }
    };
    return (0, jsx_runtime_1.jsx)("div", { className: 'dmx-scene', children: ledBarConfigs.map(ledBarConfig => ((0, jsx_runtime_1.jsx)(LedBar_1.default, { style: ledBarConfig.style, dmxHexSignal: dmxHexSignal, size: ledBarConfig.rgbDotsCount, channel: ledBarConfig.channel, selectedRedChannels: selectedRedChannels, onSelectRedChannels: onSelectRedChannels }))) });
};
exports.default = DmxScene;
//# sourceMappingURL=DmxScene.js.map