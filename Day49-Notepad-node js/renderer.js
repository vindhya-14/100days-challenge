const { ipcRenderer } = require("electron");

function saveFile() {
  const content = document.getElementById("editor").value;
  ipcRenderer.send("save-file", content);
}

function openFile() {
  ipcRenderer.send("open-file");
}

ipcRenderer.on("file-opened", (event, content) => {
  document.getElementById("editor").value = content;
});
