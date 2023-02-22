export const IpcMessage = {
    Close: "close",
    Quit: "quit",
    Log: "log",
    Execute: "execute",
    Self: "self",
    FullScreen: "fullScreen",
    BlueToothPair: "bluetooth-pairing-response",
    BlueToothList: "blueToothList",
    BlueToothSelect: "blueToothSelect",
    BlueToothCancel: "blueToothCancel",

    FileRead: "fileRead",
    FileWrite: "fileWrite",
};

export const FileType = {
    Text: "text",
    Bytes: "bytes",
};

export const WindowMessage = {
    BlueTooth: "select-bluetooth-device",
};

export const Bridges = {
    Dispatcher: "$Dispatcher",
    File: "$File",
    Navigator: "$Navigator",
    BlueTooth: "$BlueTooth",
};

export const LogLevel = {
    Debug: "debug",
    Log: "log",
    Warn: "warn",
    Info: "info",
    Error: "error",
};

export const WindowType = {
    Main: "main",
    BlueTooth: "bluetooth",
};

export const ComponentKey = {
    BlueTooth: "C-BlueTooth",
    Dotpen: "C-Dotpen",
    ConnectStatus: "C-ConnectStatus",
    User: "C-UserIdentity",
    Activities: "C-Activities",
    ModifingActivity: "C-ModifingActivity",
    ScanList: "C-ScanList",
    GlobalHandler: "C-GlobalHandler",
};

export class Dotpen {
    constructor() {
        this.$ConnectStatus = ConnectStatus.Disconnected;
        this.$Name = null;
        this.$Pen = null;
        this.$ScanList = [];
    }
}

export class BlueTooth {
    static requesting() {
        return this.promiseInternal != null;
    }
    static async requestDevice(config) {
        if (this.promiseInternal != null) return this.promiseInternal;
        const ret = (this.promiseInternal =
            navigator.bluetooth.requestDevice(config));
        try {
            try {
                return await ret;
            } catch (e) {
                return console.log(e);
            }
        } finally {
            delete this.promiseInternal;
        }
    }
}
export const BlueToothConnecter = new BlueTooth();

export const ConnectStatus = {
    Disconnected: "disconnected",
    Connected: "connected",
    Connecting: "connecting",
};

export const Handlers = {
    QuitPlay: "H-QuitPlay",
};

export class GlobalEvent {
    static addListener(handler, event) {
        if (typeof handler != "string") {
            throw `handler ${handler} should be string`;
        }
        if (typeof event != "function") {
            throw `event ${event} should be function`;
        }
        if (!this.Handlers) {
            this.Handlers = {};
        }
        if (!this.Handlers[handler]) {
            this.Handlers[handler] = [];
        } else if (this.Handlers.findIndex((x) => x == event) != -1) {
            return;
        }
        this.Handlers[handler].push(event);
    }
    static removeListener(handler, event) {
        if (typeof handler != "string") {
            throw `handler ${handler} should be string`;
        }
        if (typeof event != "function") {
            throw `event ${event} should be function`;
        }
        if (!this.Handlers[handler]) {
            return;
        }
        let index = this.Handlers[handler].findIndex((x) => x == event);
        if (index >= 0) {
            this.Handlers[handler].splice(index, 1);
        }
        if (this.Handlers[handler].length == 0) {
            delete this.Handlers[handler];
        }
    }
    static trigger(handler, ...args) {
        if (this.Handlers[handler]) {
            this.Handlers[handler].forEach((event) => {
                event(args);
            });
        }
    }
}

export class GUID {
    static NewGuid() {
        let txt = "1234567890";
        let len = 13;
        let pwd = "";
        for (let i = 0; i < len; i++) {
            pwd += txt.charAt(Math.floor(Math.random() * txt.length));
        }
        return new Date().valueOf() + pwd;
    }
}
