"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
require("./Statuses.scss");
const RealTimeContext_1 = require("../../contexts/RealTimeContext");
const Icons_1 = require("../DesignSystem/Icons");
const Statuses = () => {
    const { enttecOpenUSBState } = (0, RealTimeContext_1.useRealTimeContext)();
    const openUsbColor = {
        'Not connected': 'gray',
        'Connected': 'green',
        'Initializing': 'orange',
        'Identified': 'orange',
    }[enttecOpenUSBState] || 'gray';
    return (0, jsx_runtime_1.jsx)(jsx_runtime_1.Fragment, { children: (0, jsx_runtime_1.jsx)("div", { className: `status-icon ${openUsbColor}`, children: (0, Icons_1.UsbIcon)() }) });
};
exports.default = Statuses;
//# sourceMappingURL=Statuses.js.map