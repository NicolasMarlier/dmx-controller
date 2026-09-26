"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DmxEffect_1 = __importDefault(require("./DmxEffect"));
class DmxSet extends DmxEffect_1.default {
    static transformDmxHexSignal = (dmxHexSignal, _completeness, dmxButton, _trigger) => {
        return DmxEffect_1.default.setToColor(dmxButton.red_channels, dmxButton.color, dmxHexSignal);
    };
}
exports.default = DmxSet;
//# sourceMappingURL=DmxSet.js.map