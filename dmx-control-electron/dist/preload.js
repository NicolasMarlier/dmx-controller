"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const invoke = (channel, ...args) => electron_1.ipcRenderer.invoke(channel, ...args);
electron_1.contextBridge.exposeInMainWorld('dmxControl', {
    appName: 'DMX CONTROL',
    version: process.versions.electron,
    api: { invoke }
});
//# sourceMappingURL=preload.js.map