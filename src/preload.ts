// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";

// type definition for the api
interface Api {
  getData: () => Promise<any[]>;
  savePdf: () => Promise<any[]>;
}

contextBridge.exposeInMainWorld("api", {
  getData: async () => ipcRenderer.invoke("getData"),
  savePdf: async () => ipcRenderer.invoke("savePdf"),
});

declare global {
  interface Window {
    api: Api;
  }
}
