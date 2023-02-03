const { contextBridge, ipcRenderer, ipcMain } = require("electron");
const { IpcMessage } = require("./utils/Definition");

const bridge = {
    listen: (handler, callback) => {
        ipcRenderer.on(handler, callback);
    },
    invoke: (handler) => ipcRenderer.send(handler),
    testLogger: (...args) => {
        ipcRenderer.send(IpcMessage.Log, args);
    },
    promise:(handler,...args) => {
        return new Promise((res,rej)=>{
            let callback;
            callback = (e,...result) => {
                console.log(e);
                ipcRenderer.off(handler,callback);
                res(result[0]);
            }
            ipcRenderer.on(handler,callback);
            ipcRenderer.send(handler,args);
        });
    },
    execute: (fun) => ipcRenderer.send(IpcMessage.Execute, fun),
    identity: () => {
        // return new Promise((res, rej) => {
        //     let handler;
        //     handler = (e, name) => {
        //         ipcRenderer.off(IpcMessage.Self, handler);
        //         if(name[0]){
        //             res(name[0]);
        //         }else{
        //             rej("name not found");
        //         }
        //     };
        //     ipcRenderer.on(IpcMessage.Self, handler);
        //     ipcRenderer.send(IpcMessage.Self);
        // });
        return this.promise(IpcMessage.Self)
    },
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
    document.querySelector("#closer").addEventListener("click", () => {
        bridge.invoke(IpcMessage.Close);
    });
};
