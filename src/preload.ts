// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// type definition for the api
interface Api {
  getData: () => Promise<any[]>;
  readTemplate: () => Promise<any>;
}

contextBridge.exposeInMainWorld("api", {
  getData: async () => ipcRenderer.invoke("getData"),
  readTemplate: async () => ipcRenderer.invoke("readTemplate"),
});

declare global {
  interface Window {
    api: Api;
  }
}
