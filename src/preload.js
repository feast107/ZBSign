const { contextBridge, ipcRenderer } = require("electron");
const { IpcMessage, Bridges, FileType } = require("./utils/Definition");

const dispatcher = {
    listen: (handler, callback) => {
        ipcRenderer.on(handler, function (_, ...args) {
            callback(args);
        });
    },
    invoke: (handler, ...args) => ipcRenderer.send(handler, args),
    testLogger: (...args) => {
        ipcRenderer.send(IpcMessage.Log, args);
    },
    promise: async (handler, ...args) => {
        return new Promise((s, _) => {
            let callback;
            callback = (e, ...result) => {
                console.log(e);
                ipcRenderer.off(handler, callback);
                s(result[0]);
            };
            ipcRenderer.on(handler, callback);
            ipcRenderer.send(handler, args);
        });
    },
    execute: (fun) => ipcRenderer.send(IpcMessage.Execute, fun),
};

const fileRequest = (fileName, fileType) => {
    return new Promise((s, e) => {
        let handler;
        handler = (_, name, type, value) => {
            console.log(value);
            if (name != fileName || type != fileType) return;
            ipcRenderer.off(IpcMessage.FileRead, handler);
            s(value);
        };
        ipcRenderer.on(IpcMessage.FileRead, handler);
        ipcRenderer.send(IpcMessage.FileRead, fileType, fileName);
    });
};

const file = {
    readAllText(fileName) {
        return fileRequest(fileName, FileType.Text);
    },
    readAllBytes(fileName) {
        return fileRequest(fileName, FileType.Bytes);
    },
};

ipcRenderer.on(IpcMessage.Log, function (_, __) {
    let extractArray = (message, executive) => {
        if (message instanceof Array) {
            message.forEach((m) => extractArray(m, executive));
        } else {
            executive(message);
        }
    };
    if (arguments.length <= 1) {
        return;
    }
    let key = arguments[1];
    for (let i = 2; i < arguments.length; i++) {
        if (arguments[i] instanceof Array) {
            extractArray(arguments[i], console[key]);
        } else {
            console[key](arguments[i]);
        }
    }
});
contextBridge.exposeInMainWorld(Bridges.Dispatcher, dispatcher);
contextBridge.exposeInMainWorld(Bridges.File, file);
window.onload = function () {};
