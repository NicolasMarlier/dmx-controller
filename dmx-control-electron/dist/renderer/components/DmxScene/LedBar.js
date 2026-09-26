"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./LedBar.scss");
const RgbDot_1 = __importDefault(require("./RgbDot"));
// DMX Channels are setup on device, from 001 to 511
// The DMX signal is composed on hexadecimal values
const dmxSignalAtChannel = (dmxHexSignal, channel) => {
    return parseInt(dmxHexSignal.slice(2 * channel, 2 * channel + 2), 16) || 0;
};
const LedBar = (props) => {
    const { size, dmxHexSignal, channel, selectedRedChannels, onSelectRedChannels, style } = props;
    const redChannels = Array.from(Array(size).keys()).map((i) => channel + i * 3);
    const selected = redChannels.every(redChannel => selectedRedChannels.includes(redChannel));
    const handleClick = (e) => {
        if (e.target == e.currentTarget) {
            onSelectRedChannels(redChannels, !selected);
        }
    };
    return (0, jsx_runtime_1.jsx)("div", { className: `led-bar ${selected ? 'selected' : ''}`, onClick: handleClick, style: style, children: redChannels.map((redChannel) => ((0, jsx_runtime_1.jsx)(RgbDot_1.default, { red: dmxSignalAtChannel(dmxHexSignal, redChannel + 0), green: dmxSignalAtChannel(dmxHexSignal, redChannel + 1), blue: dmxSignalAtChannel(dmxHexSignal, redChannel + 2), selected: !selected && selectedRedChannels.includes(redChannel), onClick: () => onSelectRedChannels([redChannel], !selectedRedChannels.includes(redChannel)) }, redChannel))) });
};
exports.default = LedBar;
//# sourceMappingURL=LedBar.js.map