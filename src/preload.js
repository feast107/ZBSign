const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const { IpcMessage } = require("./utils/Definition");

const bridge = {
    listen: (handler, callback) => {
        ipcRenderer.on(handler, function (_, ...args) {
            callback(args);
        });
    },
    invoke: (handler, ...args) => ipcRenderer.send(handler, args),
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
    requestDevice: (config) => {
        console.log(this);
        if (this.$Promise) return this.$Promise;
        let ret = (this.$Promise = navigator.bluetooth.requestDevice(config));
        ret.then((e) => console.log(e))
            .catch((e) => console.log(e))
            .finally(() => {
                delete this.$Promise;
            });
        return ret;
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
contextBridge.exposeInMainWorld("$Dispatcher", bridge);
window.onload = function(){
    console.log("window on load")
    console.log(document);
    document.$Navigator = {
        $BlueTooth: {
            requestDevice(config) {
                console.log(this);
                if (this.$Promise) return this.$Promise;
                let ret = (this.$Promise =
                    navigator.bluetooth.requestDevice(config));
                ret.then((e) => console.log(e))
                    .catch((e) => console.log(e))
                    .finally(() => {
                        delete this.$Promise;
                    });
                return ret;
            },
        },
    };
};
