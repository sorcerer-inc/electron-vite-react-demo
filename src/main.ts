import { app, BrowserWindow, ipcMain } from "electron";
import path from "path";
import started from "electron-squirrel-startup";
const Database: typeof import("better-sqlite3") = require("better-sqlite3");
import ExcelJS from "exceljs";

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

const createWindow = () => {
  // Create the browser window.
  const mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`));
  }

  // Open the DevTools.
  mainWindow.webContents.openDevTools();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.

// TODO: pathを解決
const dbPath = path.resolve(__dirname, "../../db/test.db");
const db = new Database(dbPath);
db.pragma("journal_mode = WAL");

function getData() {
  const rows = db.prepare("SELECT * FROM test").all();
  return rows;
}

ipcMain.handle("getData", async () => {
  return getData();
});

async function readTemplateBuffer() {
  const path_excel_template = path.resolve(__dirname, "../../template/csm議事録.xltx");
  console.log('readTemplate. path_excel_template:', path_excel_template);

  const workbook = new ExcelJS.Workbook();
  try {
    console.log('readTemplate. xlsx.readFile');
    await workbook.xlsx.readFile(path_excel_template);
  } catch (err) {
    console.error('readTemplate. エラーが発生しました:', err);
  }
  if (workbook.worksheets.length == 0) {
    throw new Error("readTemplate. テンプレートExcelにシートが見つかりません");
  }
  const sheet = workbook.worksheets[0];
  console.log('readTemplate. sheet.name:', sheet.name);

  // バッファ形式で渡し、クライアント側でロードする
  return workbook.xlsx.writeBuffer();
}

ipcMain.handle("readTemplateBuffer", async () => {
  return readTemplateBuffer();
});
