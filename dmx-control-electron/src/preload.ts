import { contextBridge, ipcRenderer } from 'electron';
import type { ApiContract, Channel } from './shared/ipc-contract';


const invoke = <C extends Channel>(channel: C, ...args: ApiContract[C]['args']) =>
  ipcRenderer.invoke(channel, ...args) as Promise<ApiContract[C]['result']>;

contextBridge.exposeInMainWorld('dmxControl', {
  appName: 'DMX CONTROL',
  version: process.versions.electron,
  api: {invoke}
});

declare global {
  interface Window { dmxControl: {api: { invoke: typeof invoke }} }
}