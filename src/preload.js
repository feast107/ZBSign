const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const { IpcMessage } = require("./utils/Definition");

const bridge = {
    listen: (handler, callback) => {
        ipcRenderer.on(handler, function (_, ...args) {
            callback(args);
        });
    },
    invoke: (handler,...args) => ipcRenderer.send(handler,args),
    testLogger: (...args) => {
        ipcRenderer.send(IpcMessage.Log, args);
    },
    promise: (handler, ...args) => {
        return new Promise((res, rej) => {
            let callback;
            callback = (e, ...result) => {
                console.log(e);
                ipcRenderer.off(handler, callback);
                res(result[0]);
            };
            ipcRenderer.on(handler, callback);
            ipcRenderer.send(handler, args);
        });
    },
    execute: (fun) => ipcRenderer.send(IpcMessage.Execute, fun),
};

ipcRenderer.on(IpcMessage.Log, function (_, __) {
    if (arguments.length <= 1) {
        return;
    }
    let key = arguments[1];
    for (let i = 2; i < arguments.length; i++) {
        console[key](arguments[i]);
    }
});
contextBridge.exposeInMainWorld("$Dispatcher", bridge);
window.onload = () => {
    // document.querySelector("#closer").addEventListener("click", () => {
    //     bridge.invoke(IpcMessage.Close);
    // });
};
