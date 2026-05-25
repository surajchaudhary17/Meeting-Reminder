const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
    onMeeting: (callback) => ipcRenderer.on("meeting", (_, data) => callback(data))
});