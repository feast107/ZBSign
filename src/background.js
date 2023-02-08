"use strict";
import { app, protocol, BrowserWindow, ipcMain } from "electron";
import { createProtocol } from "vue-cli-plugin-electron-builder/lib";
import installExtension, { VUEJS3_DEVTOOLS } from "electron-devtools-installer";
import path from "path";
import { screen } from "electron";
import { IpcMessage, WindowMessage, WindowType } from "./utils/Definition";
const isDevelopment = process.env.NODE_ENV !== "production";
import { application } from "./dispatcher/Application";
// Scheme must be registered before the app is ready
protocol.registerSchemesAsPrivileged([
    { scheme: "app", privileges: { secure: true, standard: true } },
]);

async function createWindow() {
    const primaryDisplay = screen.getPrimaryDisplay();
    const { width, height } = primaryDisplay.workAreaSize;
    // Create the browser window.
    const mainWin = application.createWindow(WindowType.Main, {
        width: width,
        height: height,
        frame: false,
        transparent: false,
        fullscreenable: true,
        //fullscreen: true,
        //simpleFullscreen:true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: true,
            preload: path.join(__dirname, "/preload.js"),
            webSecurity: false,
        },
        closable: true,
    });
    mainWin.on("closed", () => {
        application.closeAll();
    });
    if (process.env.WEBPACK_DEV_SERVER_URL) {
        // Load the url of the dev server if in development mode
        if (!process.env.IS_TEST) mainWin.webContents.openDevTools();
        await mainWin.loadURL(
            process.env.WEBPACK_DEV_SERVER_URL + WindowType.Main
        );
    } else {
        createProtocol("app");
        // Load the index.html when not in development
        mainWin.loadURL("app://./index.html");
    }
    // Listen for a message from the renderer to get the response for the Bluetooth pairing.
    ipcMain.on(IpcMessage.BlueToothPair, (e, ...args) => {
        console.log({ event: e, response: args });
        this.bluetoothPinCallback(args);
    });
    //#region
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
    mainWin.webContents.session.setBluetoothPairingHandler(
        (details, callback) => {
            this.bluetoothPinCallback = callback;
            // Send a message to the renderer to prompt the user to confirm the pairing.
            mainWin.webContents.send(IpcMessage.BlueToothPair, details);
        }
    );
    mainWin.webContents.on(
        WindowMessage.BlueTooth,
        (event, deviceList, callback) => {
            event.preventDefault();
            if (!event.sender.$Scope.$BlueToothConnecting) {
                event.sender.$Scope.$BlueToothConnecting = true;
                let connectHandler;
                let cancelHandler;
                connectHandler = (e, ...args) => {
                    console.log(args);
                    ipcMain.off(IpcMessage.BlueToothSelect, connectHandler);
                    ipcMain.off(IpcMessage.BlueToothCancel, cancelHandler);
                    e.sender.$Scope.$BlueToothConnecting = false;
                    callback(args[0][0]);
                };
                cancelHandler = (e, _) => {
                    application.$Logger.warn("Cancel request");
                    ipcMain.off(IpcMessage.BlueToothSelect, connectHandler);
                    ipcMain.off(IpcMessage.BlueToothCancel, cancelHandler);
                    e.sender.$Scope.$BlueToothConnecting = false;
                    callback("");
                };
                ipcMain.on(IpcMessage.BlueToothSelect, connectHandler);
                ipcMain.on(IpcMessage.BlueToothCancel, cancelHandler);
            }
            if (deviceList && deviceList.length > 0) {
                mainWin.webContents.send(IpcMessage.BlueToothList, deviceList);
            }
        }
    );

    //#endregion
}

// Quit when all windows are closed.
app.on("window-all-closed", () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== "darwin") {
        app.quit();
    }
});

app.on("activate", () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
});

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", async () => {
    if (isDevelopment && !process.env.IS_TEST) {
        // Install Vue Devtools
        try {
            await installExtension(VUEJS3_DEVTOOLS);
        } catch (e) {
            console.error("Vue Devtools failed to install:", e.toString());
        }
    }
    createWindow();
});

// Exit cleanly on request from parent process in development mode.
if (isDevelopment) {
    if (process.platform === "win32") {
        process.on("message", (data) => {
            if (data === "graceful-exit") {
                app.quit();
            }
        });
    } else {
        process.on("SIGTERM", () => {
            app.quit();
        });
    }
}
