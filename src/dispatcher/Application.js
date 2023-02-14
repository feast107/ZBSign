import { IpcMessage, LogLevel } from "@/utils/Definition";
import { BrowserWindow } from "electron";

export class Scope {
    /**
     * 创建一个Scope
     * @param {string} name
     * @param {BrowserWindow} window
     */
    constructor(name, window) {
        this.$Name = name;
        this.$Window = window;
        this.$Logger = {};
        this.$BlueToothConnecting = false;
        Object.keys(LogLevel).forEach((level) => {
            let handler = LogLevel[level];
            this.$Logger[handler] = function (...args) {
                if(args.length == 1 && args[0] instanceof Array){
                    args = args[0];
                }
                window.webContents.send(IpcMessage.Log, handler, args);
            };
        });
    }
    close() {
        this.$Window.close();
    }
    send(handler, ...args) {
        this.$Window.webContents.send(handler, args);
    }
}

export class Application {
    constructor() {
        this.$Windows = {};
        this.$Logger = {};
        let ref = this;
        Object.keys(LogLevel).forEach((level) => {
            let handler = LogLevel[level];
            this.$Logger[handler] = (...args) => {
                ref.getAllWindow().forEach((win) =>
                    win.webContents.$Scope.$Logger[handler](args)
                );
            };
        });
        Object.freeze(this);
    }
    /**
     * 创建窗口
     * @param {string} name
     * @param {Electron.BrowserWindowConstructorOptions} config
     * @returns
     */
    createWindow(name, config) {
        if (!name) throw "Window name required";
        let win = new BrowserWindow(config);
        let check = this.$Windows[name];
        if (!check) {
            this.$Windows[name] = win;
        } else if (check instanceof BrowserWindow) {
            this.$Windows[name] = [check, win];
        } else if (check instanceof Array) {
            check.push(win);
        }
        let closeHandler = () => {
            let closable = this.$Windows[name];
            if (!closable) return;
            if (closable instanceof BrowserWindow) {
                delete this.$Windows[name];
            }
            if (closable instanceof Array) {
                closable.splice(
                    closable.findIndex((x) => x === win),
                    1
                );
                if (closable.length <= 0) {
                    delete this.$Windows[name];
                }
            }
        };
        win.webContents.$Scope = new Scope(name, win);
        win.on("closed", () => closeHandler());
        win.webContents.send(IpcMessage.Self, name);
        return win;
    }
    closeAll() {
        console.log(this.$Windows);
        Object.keys(this.$Windows).forEach((key) => {
            let targ = this.$Windows[key];
            if (targ instanceof BrowserWindow) {
                targ.close();
            } else if (targ instanceof Array) {
                targ.forEach((win) => {
                    if (win instanceof BrowserWindow) {
                        win.close();
                    }
                });
            }
            delete this.$Windows[key];
        });
    }
    /**
     * 获取窗口，为window或者array
     * @param {string} name
     * @returns
     */
    getWindow(name) {
        return this.$Windows[name];
    }
    /**
     * 
     * @returns {Array<BrowserWindow>} windows
     */
    getAllWindow() {
        let ret = [];
        Object.keys(this.$Windows).forEach((x) => {
            let win = this.$Windows[x];
            if (!win) return;
            if (win instanceof BrowserWindow) {
                ret.push(win);
            }
            if (win instanceof Array) {
                win.forEach((w) => {
                    ret.push(w);
                });
            }
        });
        return ret;
    }
}
export const application = new Application();
