import { IpcMessage, LogLevel } from "@/utils/Definition";
import { BrowserWindow } from "electron";
/**
 * Application
 * {
 *     $Windows:[],
 *     $Logger:{ log(),debug(),info(),warn(),error() },
 * }
 */
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
        let scope = (win.webContents.$Scope = {
            $Name: name,
            close: () => {
                win.close();
            },
            send: (handler, ...args) => {
                win.webContents.send(handler, args);
            },
            $Logger: {},
        });
        win.on("closed", () => closeHandler());
        Object.keys(LogLevel).forEach((level) => {
            let handler = LogLevel[level];
            scope.$Logger[handler] = function (...args) {
                win.webContents.send(IpcMessage.Log, handler, args);
            };
        });
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
    getWindow(name) {
        return this.$Windows[name];
    }
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
