<template>
    <el-scrollbar>
        <el-table :data="dotpen.$ScanList">
            <el-table-column prop="deviceName" label="名称" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button v-if="!this.dotpen.isSameDevice(scope.row)" type="primary" plain
                        :disabled="this.dotpen.$ConnectStatus == 'connecting'" :loading="scope.row.connecting"
                        @click="scanAndConnect(scope.row)">
                        连接
                    </el-button>

                    <el-button v-else type="danger" plain :disabled="this.dotpen.$ConnectStatus == 'connecting'"
                        :loading="scope.row.connecting" @click="disconnect(scope.row)">
                        断开
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-scrollbar>
</template>

<script>
import { Dot } from "@/models/Canvas";
import { ComponentKey, Bridges, IpcMessage, Dotpen, ConnectStatus, BlueTooth } from "@/utils/Definition";
import TStudyDigitalPen from "../../driver/PenDriver.js";
export default {
    inject: [ComponentKey.Dotpen],
    data() {
        return {
            /**
             * @type {Dotpen}
             */
            dotpen: this[ComponentKey.Dotpen],
            connectionStatus: "未连接",
            penName: "",
            penSerial: "",
            writeStatus: "",
            coorInfo: "",
            functionDisabled: true,
            scanDisabled: false,
            isPenDown: false,
            //points:[],
            dotwdith: 5600,
            dotheight: 7920,
            drawWidth: 1000,
            drawHeight: 1414,
            rawResult: "",
            lastPt: {},
            trying: false,
            isDown: false,
        };
    },
    mounted() {
        TStudyDigitalPen.getInstance().loadLicense("", "");
    },
    methods: {
        scanAndConnect(device) {
            this.dotpen.setConnecting(device);
            TStudyDigitalPen
                .getInstance()
                .setCallbackDelegate(
                    this.callbacks()
                );
            TStudyDigitalPen
                .getInstance()
                .scanAndConnectPen()
                .then((ret) => {
                    if (!ret) {
                        this.dotpen.setDisconnect();
                        device.connecting = false; return
                    }
                    this.dotpen
                        .setConnect(device, TStudyDigitalPen.getInstance());
                    console.log("--连接成功--");

                    let coldDown = 75;
                    setTimeout(() => {
                        TStudyDigitalPen.getInstance().clearPenOfflineData();
                        setTimeout(() => {
                            TStudyDigitalPen.getInstance().getPenInfo();
                            setTimeout(() => {
                                TStudyDigitalPen.getInstance().getPenMACAddress();
                                setTimeout(() => {
                                    TStudyDigitalPen.getInstance().receiveRealtimeMode();
                                }, coldDown);
                            }, coldDown);
                        }, coldDown);
                    }, coldDown);
                })
                .catch((error) => {
                    this.rawResult = error.toString();
                    this.dotpen.setDisconnect();
                    device.connecting = false;
                });
            window[Bridges.Dispatcher].invoke(
                IpcMessage.BlueToothSelect,
                device.deviceId
            );
        },
        disconnect() {
            if (!this.dotpen.isConnected()) return;
            this.dotpen.setDisconnect();
            TStudyDigitalPen.getInstance().disconnectPen();
            this.functionDisabled = true;
            this.scannDisabled = false;
            BlueTooth.requestDevice({
                filters: [
                    {
                        namePrefix: "TD",
                        services: [
                            "0000fff0-0000-1000-8000-00805f9b34fb",
                        ],
                    },
                ],
            })
        },
        callbacks: function () {
            var data = this;
            return {
                onPenConnectionStateChange: function ({ name, connect }) {
                    console.log("onPenConnectionStateChange: ", name, connect);
                    data.connectionStatus = `${connect ? "已连接" : "未连接"
                        }`;
                    if (!connect) {
                        data.dotpen.setDisconnect();

                        data.functionDisabled = true;
                        data.scanDisabled = false;
                        data.penName = "";
                        data.penSerial = "";
                    } else {
                        data.functionDisabled = false;
                        data.scanDisabled = true;
                        data.penName = name;
                    }
                },
                onReceivePenInfo: function (info) {
                    console.log(info);
                    data.rawResult = info;
                    data.penSerial = info.PEN_ID;
                    data.dotpen.$Name = info.PEN_ID;
                    data.rawResult =
                        "onReceivePenInfo:" + JSON.stringify(info);
                },
                onReceivePenMACAddress: function (MAC) {
                    console.log(MAC);
                    data.rawResult =
                        "onReceivePenMACAddress:" + JSON.stringify(MAC);
                },
                onReceivePenBatteryInfo: function (battery) {
                    console.log(battery);
                    data.rawResult =
                        "onReceivePenBatteryInfo:" + JSON.stringify(battery);
                },
                onReceivePenRTC: function (timestamp) {
                    console.log(timestamp);
                    data.rawResult =
                        "onReceivePenRTC:" + JSON.stringify(timestamp);
                },
                onReceivePenPowerOffTime: function (time) {
                    console.log(time);
                    data.rawResult =
                        "onReceivePenPowerOffTime:" + JSON.stringify(time);
                },
                onReceivePen_Warning: function (warning) {
                    let content = "";
                    if (warning.type === 0x04) {
                        content = "电池电量过低时将主动断开蓝牙连接";
                    } else if (warning.type == 0x05) {
                        content =
                            "当电池电量低于 20%时将每隔 1 分钟上报一次警告";
                    }
                    console.log(content);
                    data.rawResult =
                        "onReceivePen_Warning:" + JSON.stringify(warning);
                },
                onReceivePenOfflineDataInfo: function ({ size, percent }) {
                    console.log(`总大小: ${size}字节; 百分比: ${percent}%`);
                    data.rawResult =
                        "onReceivePenOfflineDataInfo:" +
                        JSON.stringify({ size, percent });
                },
                onClearPenOfflineData: function () {
                    console.log("清空离线数据");
                    data.rawResult = "onClearPenOfflineData:";
                },
                onReceivePenStrokeData: function ({
                    coordX,
                    coordY,
                    coordForce,
                    pageAddress,
                    time,
                    coordMode,
                }) {
                    if(!data.isDown){ data.isDown = true; }
                    data.dotpen.trigger(Dot.Move(coordX, coordY, pageAddress));
                },
                onPenDown: function ({ coordMode }) {
                    if(!data.isDown){ data.isDown = true; }
                    data.dotpen.trigger(Dot.Down);
                },
                onPenUp: function ({ coordMode }) {
                    if(data.isDown){
                        data.isDown = false;
                        data.dotpen.trigger(Dot.Up);
                    }
                },
                onStartReceivePenOfflineData: function () {
                    console.log("onStartReceivePenOfflineData");
                    data.rawResult = "onStartReceivePenOfflineData:";
                },
                onReceivedPenOfflineData: function ({
                    totalSize,
                    receiveSize,
                }) {
                    console.log(
                        "onReceivedPenOfflineData",
                        totalSize,
                        receiveSize
                    );
                    data.rawResult =
                        "onReceivedPenOfflineData:" +
                        JSON.stringify({ totalSize, receiveSize });
                },
                onFinishReceivePenOfflineData: function () {
                    console.log("onFinishReceivePenOfflineData");
                    data.rawResult = "onFinishReceivePenOfflineData:";
                },
                onPenPageChange: function ({ pageAddress }) {

                },
            };
        },
    },
};
</script>

<style lang="scss"></style>
