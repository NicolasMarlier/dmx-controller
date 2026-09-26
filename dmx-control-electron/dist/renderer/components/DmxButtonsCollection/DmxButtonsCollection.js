"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./DmxButtonsCollection.scss");
const DmxButton_1 = __importDefault(require("./DmxButton"));
const DmxButtonsContext_1 = require("../../contexts/DmxButtonsContext");
const ApiClient_1 = require("../../ApiClient");
const DmxButtonsCollection = () => {
    const { program, dmxButtons, setSelectedDmxButtonId, selectedDmxButtonId, createDmxButtonAndSync } = (0, DmxButtonsContext_1.useDmxButtonsContext)();
    const selectAndPlayDmxButton = (dmxButtonId) => {
        setSelectedDmxButtonId(dmxButtonId);
        (0, ApiClient_1.playDmxButton)(dmxButtonId);
    };
    return (0, jsx_runtime_1.jsxs)("div", { className: 'dmx-buttons', children: [dmxButtons.map((dmxButton) => ((0, jsx_runtime_1.jsx)(DmxButton_1.default, { onTap: () => {
                    selectAndPlayDmxButton(dmxButton.id);
                }, selected: selectedDmxButtonId == dmxButton.id, isPlaying: false, dmxButton: dmxButton }, dmxButton.id))), program && dmxButtons.length < 12 && (0, jsx_runtime_1.jsx)("div", { className: 'empty-btn', onClick: createDmxButtonAndSync, children: "NEW DMX BUTTON" }), !program && (0, jsx_runtime_1.jsx)("div", { className: 'empty-btn' })] });
};
exports.default = DmxButtonsCollection;
//# sourceMappingURL=DmxButtonsCollection.js.map