const { app, BrowserWindow, dialog, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  mainWindow.loadFile("index.html");
}

app.on("ready", createWindow);

// Handle file saving
ipcMain.on("save-file", (event, content) => {
  dialog.showSaveDialog({
    title: "Save File",
    defaultPath: "untitled.txt",
    filters: [{ name: "Text Files", extensions: ["txt"] }]
  }).then(file => {
    if (!file.canceled) {
      fs.writeFileSync(file.filePath.toString(), content, "utf-8");
    }
  });
});

// Handle file opening
ipcMain.on("open-file", (event) => {
  dialog.showOpenDialog({
    properties: ["openFile"],
    filters: [{ name: "Text Files", extensions: ["txt"] }]
  }).then(file => {
    if (!file.canceled) {
      const content = fs.readFileSync(file.filePaths[0], "utf-8");
      event.sender.send("file-opened", content);
    }
  });
});
