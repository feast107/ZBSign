import { app } from "electron";
import { application } from "./dispatcher/Application";
import { FileType, IpcMessage } from "./utils/Definition";
import fs from "fs";
export const Events = {
    /**
     *
     * @param {Electron.ipcMain} ipcMain
     */
    Register(ipcMain) {
        // Listen for a message from the renderer to get the response for the Bluetooth pairing.
        ipcMain.on(IpcMessage.Close, (e, ...args) => {
            e.sender.$Scope.close();
        });
        ipcMain.on(IpcMessage.Quit, (e, ...args) => {
            app.quit();
        });
        ipcMain.on(IpcMessage.Log, (e, ...args) => {
            application.$Logger.log("This is test logger info", args);
        });
        ipcMain.on(IpcMessage.Self, (e) => {
            e.sender.$Scope.send(IpcMessage.Self, e.sender.$Scope.$Name);
        });
        ipcMain.on(IpcMessage.BlueToothPair, (e, ...args) => {
            console.log({ event: e, response: args });
            this.bluetoothPinCallback(args);
        });
        ipcMain.on(IpcMessage.FullScreen, (e) => {
            e.sender.setFullScreen(!e.sender.isFullScreen());
        });

        ipcMain.on(IpcMessage.FileRead, (e, type, name) => {
            switch (type) {
                case FileType.Text:
                    fs.readFile(name, (err, data) => {
                        e.sender.send(
                            IpcMessage.FileRead,
                            name,
                            type,
                            err ? null : data
                        );
                        e.sender.$Scope.$Logger.log(`File Read ${type} ${name} ${err} ${data}`);
                    });
                    break;
                case FileType.Bytes:
                    break;
            }
            e.sender.send(IpcMessage.FileRead, name, type, null);
        });
    },
};
