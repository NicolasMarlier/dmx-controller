"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
//import { StrictMode } from 'react'
const client_1 = require("react-dom/client");
require("./index.scss");
const App_1 = __importDefault(require("./App"));
const DmxButtonsContext_1 = require("./contexts/DmxButtonsContext");
const RealTimeContext_1 = require("./contexts/RealTimeContext");
const DmxMidiContext_1 = require("./contexts/DmxMidiContext");
(0, client_1.createRoot)(document.body).render((0, jsx_runtime_1.jsx)(DmxButtonsContext_1.DmxButtonsContextProvider, { children: (0, jsx_runtime_1.jsx)(DmxMidiContext_1.DmxMidiContextProvider, { children: (0, jsx_runtime_1.jsxs)(RealTimeContext_1.RealTimeContextProvider, { children: [(0, jsx_runtime_1.jsx)(App_1.default, {}), "YO"] }) }) })
//</StrictMode>,
);
//# sourceMappingURL=root.js.map