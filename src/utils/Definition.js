export const IpcMessage = {
    Close : 'close',
    Quit : 'quit',
    Log : 'log',
    Execute : 'execute',
    Self : 'self',
    BlueToothPair : 'bluetooth-pairing-response',
    BlueToothList : 'blueToothList',
    BlueToothSelect : 'blueToothSelect',
    BlueToothCancel : 'blueToothFinish',
}

export const WindowMessage = {
    BlueTooth : 'select-bluetooth-device'
}

export const LogLevel = {
    Debug : 'debug',
    Log : 'log',
    Warn : 'warn',
    Info : 'info',
    Error : 'error'
}

export const WindowType = {
    Main : 'main',
    BlueTooth : 'bluetooth'
}

export const ComponentKey = {
    Dotpen : 'dotpen',
    ConnectStatus : 'connectStatus'
}

export class Dotpen{
    constructor(){ 
        this.$ConnectStatus = ConnectStatus.Disconnected;
        this.$Name = null;
    }
}

export const ConnectStatus = {
    Disconnected : 'disconnected',
    Connected : 'connected',
    Connecting : 'connecting'
}