<template>
    <el-scrollbar>
        <el-table :data="dotpen.$ScanList">
            <el-table-column prop="deviceName" label="名称" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button type="primary" plain :disabled="this.trying" :loading="scope.row.IsConnecting"
                        @click="SelectDevice(scope.row)">
                        连接
                    </el-button>
                </template>
            </el-table-column>
        </el-table>
    </el-scrollbar>
</template>

<script>
import { ComponentKey, Bridges, IpcMessage } from '@/utils/Definition';
import TStudyDigitalPen from "../driver/PenDriver.js";
export default {
    inject: [
        ComponentKey.Dotpen,
    ],
    data() {
        return {
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
        }
    },
    mounted() {
        TStudyDigitalPen.getInstance().loadLicense("", "");
    },
    methods: {
        SelectDevice(device) {
            this.trying = true;
            device.IsConnecting = true;
            this.scanAndConnect(device);
            window[Bridges.Dispatcher].invoke(IpcMessage.BlueToothSelect, device.deviceId);
        },
        scanAndConnect: function (device) {
            TStudyDigitalPen.getInstance().setCallbackDelegate(
                this.callbacks()
            );
            let date = new Date();
            TStudyDigitalPen.getInstance().scanAndConnectPen()
                .then((ret) => {
                    if (ret) {
                        this.trying = false;
                        device.IsConnecting = false;
                        console.log("--连接成功--");
                        TStudyDigitalPen.getInstance()
                            .getPenInfo()
                            .then(() => {
                                TStudyDigitalPen.getInstance().getPenMACAddress();
                            });
                    }
                })
                .catch((error) => {
                    console.log('No result of bluetooth Expired in:' + new String((new Date() - date) / 1000));
                    this.rawResult = error.toString();
                    this.trying = false;
                    device.IsConnecting = false;
                });
        },
        callbacks: function () {
            var vueapp = this;
            return {
                onPenConnectionStateChange: function ({ name, connect }) {
                    console.log("onPenConnectionStateChange: ", name, connect);
                    vueapp.connectionStatus = `${connect ? "已连接" : "未连接"
                        }`;
                    if (!connect) {
                        vueapp.functionDisabled = true;
                        vueapp.scanDisabled = false;
                        vueapp.penName = "";
                        vueapp.penSerial = "";
                    } else {
                        vueapp.functionDisabled = false;
                        vueapp.scanDisabled = true;

                        vueapp.penName = name;
                    }
                },
                onReceivePenInfo: function (info) {
                    console.log(info);
                    vueapp.rawResult = info;
                    vueapp.penSerial = info.PEN_ID;
                    vueapp.rawResult =
                        "onReceivePenInfo:" + JSON.stringify(info);
                },
                onReceivePenMACAddress: function (MAC) {
                    console.log(MAC);
                    vueapp.rawResult =
                        "onReceivePenMACAddress:" + JSON.stringify(MAC);
                },
                onReceivePenBatteryInfo: function (battery) {
                    console.log(battery);
                    vueapp.rawResult =
                        "onReceivePenBatteryInfo:" + JSON.stringify(battery);
                },
                onReceivePenRTC: function (timestamp) {
                    console.log(timestamp);
                    vueapp.rawResult =
                        "onReceivePenRTC:" + JSON.stringify(timestamp);
                },
                onReceivePenPowerOffTime: function (time) {
                    console.log(time);
                    vueapp.rawResult =
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
                    vueapp.rawResult =
                        "onReceivePen_Warning:" + JSON.stringify(warning);
                },
                onReceivePenOfflineDataInfo: function ({ size, percent }) {
                    console.log(`总大小: ${size}字节; 百分比: ${percent}%`);
                    vueapp.rawResult =
                        "onReceivePenOfflineDataInfo:" +
                        JSON.stringify({ size, percent });
                },
                onClearPenOfflineData: function () {
                    console.log("清空离线数据");
                    vueapp.rawResult = "onClearPenOfflineData:";
                },
                onReceivePenStrokeData: function ({
                    coordX,
                    coordY,
                    coordForce,
                    pageAddress,
                    time,
                    coordMode,
                }) {
                    vueapp.coorInfo = `[${coordX},${coordY}] ${pageAddress}`;
                    vueapp.rawResult =
                        "onReceivePenStrokeData:" +
                        JSON.stringify({
                            coordX,
                            coordY,
                            coordForce,
                            pageAddress,
                            time,
                            coordMode,
                        });
                    if (vueapp.isPenDown == true) {
                        var can = document.getElementById("myCanvas");
                        var x = (can.width / vueapp.dotwdith) * coordX;
                        var y = (can.height / vueapp.dotheight) * coordY;
                        //vueapp.points.push({x,y});
                        vueapp.drawStrokeDynamic({ x, y }, 0.8);
                    }
                },
                onPenDown: function ({ coordMode }) {
                    console.log("下笔" + coordMode);
                    vueapp.writeStatus = "落笔";
                    vueapp.isPenDown = true;

                    vueapp.rawResult = "onPenDown:";
                    vueapp.lastPt = null;
                },

                onPenUp: function ({ coordMode }) {
                    console.log("抬笔" + coordMode);
                    vueapp.writeStatus = "抬笔";
                    //var lineStroke=vueapp.points.slice()
                    //vueapp.points.length=0
                    //vueapp.drawStrokeLine(lineStroke)
                    vueapp.rawResult = "onPenUp:";

                    vueapp.isPenDown = false;
                    vueapp.lastPt = null;
                },
                onStartReceivePenOfflineData: function () {
                    console.log("onStartReceivePenOfflineData");
                    vueapp.rawResult = "onStartReceivePenOfflineData:";
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
                    vueapp.rawResult =
                        "onReceivedPenOfflineData:" +
                        JSON.stringify({ totalSize, receiveSize });
                },
                onFinishReceivePenOfflineData: function () {
                    console.log("onFinishReceivePenOfflineData");
                    vueapp.rawResult = "onFinishReceivePenOfflineData:";
                },
                onPenPageChange: function ({ pageAddress }) {
                    console.log("onPenPageChange");
                    vueapp.rawResult =
                        "onPenPageChange:" + JSON.stringify({ pageAddress });
                },
            };
        },
    }
}
</script>

<style lang="scss"></style>