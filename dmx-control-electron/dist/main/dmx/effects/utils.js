"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.setDmxAt = exports.getDmxSignalAt = exports.colorHexToArray = void 0;
const colorHexToArray = (colorHex) => {
    return [
        Number(`0x${colorHex.slice(1, 3)}`) || 0,
        Number(`0x${colorHex.slice(3, 5)}`) || 0,
        Number(`0x${colorHex.slice(5, 7)}`) || 0
    ];
};
exports.colorHexToArray = colorHexToArray;
const getDmxSignalAt = (dmxHexSignal, channel) => (parseInt(dmxHexSignal.slice(2 * channel, 2 * channel + 2), 16) || 0);
exports.getDmxSignalAt = getDmxSignalAt;
const setDmxAt = (dmxHexSignal, channel, value) => {
    const hexValue = value.toString(16).padStart(2, '0');
    return dmxHexSignal.slice(0, channel * 2) + hexValue + dmxHexSignal.slice(channel * 2 + 2);
};
exports.setDmxAt = setDmxAt;
//# sourceMappingURL=utils.js.map