"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DmxEffect_1 = __importDefault(require("./DmxEffect"));
class DmxBoom extends DmxEffect_1.default {
    static transformDmxHexSignal = (dmxHexSignal, completeness, dmxButton, _trigger) => {
        return this.setToColor(dmxButton.red_channels, dmxButton.color, dmxHexSignal, 1 - completeness);
    };
}
exports.default = DmxBoom;
//# sourceMappingURL=DmxBoom.js.map