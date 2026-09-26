"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const DmxEffect_1 = __importDefault(require("./DmxEffect"));
class DmxToggle extends DmxEffect_1.default {
    static transformDmxHexSignal = (dmxHexSignal, completeness, dmxButton, trigger) => this.setToColor(dmxButton.red_channels, dmxButton.color, dmxHexSignal, trigger.state === 'up' ? completeness : 1 - completeness);
}
exports.default = DmxToggle;
//# sourceMappingURL=DmxToggle.js.map