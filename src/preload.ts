// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts

import { contextBridge, ipcRenderer } from "electron";
import ExcelJS from "exceljs";

// type definition for the api
interface Api {
  getData: () => Promise<any[]>;
  savePdf: () => Promise<any[]>;
  readTemplateBuffer: () => Promise<ExcelJS.Buffer>;
}

contextBridge.exposeInMainWorld("api", {
  getData: async () => ipcRenderer.invoke("getData"),
  savePdf: async () => ipcRenderer.invoke("savePdf"),
  readTemplateBuffer: async () => ipcRenderer.invoke("readTemplateBuffer"),
});

declare global {
  interface Window {
    api: Api;
  }
}
