"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const utils_1 = require("./utils");
class DmxEffect {
    static transformDmxHexSignal = (dmxHexSignal, _completeness, _dmxButton, _trigger) => {
        return dmxHexSignal;
    };
    static computeCompleteness = (durationMs, triggeredAt) => (durationMs > 0
        ? Math.min(1, (Date.now() - triggeredAt) / durationMs)
        : 1);
    static setToColor = (redChannels, color, dmxHexSignal, colorIntensity = 1) => {
        let newSignal = dmxHexSignal;
        const colorArray = (0, utils_1.colorHexToArray)(color);
        redChannels.forEach(redChannel => {
            newSignal = (0, utils_1.setDmxAt)(newSignal, redChannel + 0, Math.floor(colorArray[0] * colorIntensity));
            newSignal = (0, utils_1.setDmxAt)(newSignal, redChannel + 1, Math.floor(colorArray[1] * colorIntensity));
            newSignal = (0, utils_1.setDmxAt)(newSignal, redChannel + 2, Math.floor(colorArray[2] * colorIntensity));
        });
        return newSignal;
    };
}
exports.default = DmxEffect;
//# sourceMappingURL=DmxEffect.js.map