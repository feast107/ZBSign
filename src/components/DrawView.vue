<template>
    <button
        class="close"
        onclick="window.close()"
        style="position: fixed; margin-top: 10px; right: 0; margin-right: 10px">
        CLOSE
    </button>
    <div id="draw">
        <div id="title">
            <div style="margin-left: 10px">拓思德点阵笔网页DEMO</div>
        </div>
        <div id="container">
            <div id="operation">
                <div style="float: right">
                    <table>
                        <tr></tr>
                        <tr></tr>
                        <tr>
                            <th>
                                <button v-on:click="clearDrawing">
                                    清空画布
                                </button>
                            </th>
                        </tr>
                    </table>
                </div>
                <div>
                    <table>
                        <tr>
                            <th>
                                <button id="btn" v-on:click="checkWebBluetooth">
                                    蓝牙可用性
                                </button>
                            </th>
                            <th>
                                <button
                                    id="btn"
                                    :disabled="scanDisabled"
                                    v-on:click="scanAndConnect">
                                    扫描连接
                                </button>
                            </th>
                            <th>
                                <button
                                    id="disconnect"
                                    :disabled="functionDisabled"
                                    v-on:click="disconnect">
                                    断开连接
                                </button>
                            </th>
                            <th>
                                <button
                                    id="peninfo"
                                    :disabled="functionDisabled"
                                    v-on:click="getPenInfo">
                                    获取笔信息
                                </button>
                            </th>
                            <th>
                                <button
                                    id="battery"
                                    :disabled="functionDisabled"
                                    v-on:click="getBatteryInfo">
                                    获取电量信息
                                </button>
                            </th>
                        </tr>
                        <tr align="left">
                            <th>
                                <button
                                    id="startReceiveStroke"
                                    :disabled="functionDisabled"
                                    v-on:click="startReceiveStroke">
                                    接收坐标
                                </button>
                            </th>
                            <th>
                                <button
                                    id="stopReceiveStroke"
                                    :disabled="functionDisabled"
                                    v-on:click="stopReceiveStroke">
                                    停止数据
                                </button>
                            </th>
                            <th>
                                <button
                                    id="receiveRealtimeMode"
                                    :disabled="functionDisabled"
                                    v-on:click="receiveRealtimeMode">
                                    获取实时
                                </button>
                            </th>
                            <th>
                                <button
                                    id="receiveStorageMode"
                                    :disabled="functionDisabled"
                                    v-on:click="receiveStorageMode">
                                    获取存储
                                </button>
                            </th>

                            <th>
                                <button
                                    :disabled="functionDisabled"
                                    v-on:click="hoverOn">
                                    开启悬浮
                                </button>
                            </th>
                            <th>
                                <button
                                    :disabled="functionDisabled"
                                    v-on:click="hoverOff">
                                    关闭悬浮
                                </button>
                            </th>
                        </tr>
                        <tr align="left">
                            <th>
                                <button
                                    id="mac"
                                    :disabled="functionDisabled"
                                    v-on:click="getMac">
                                    获取mac地址
                                </button>
                            </th>
                            <th>
                                <button
                                    id="getPenRTC"
                                    :disabled="functionDisabled"
                                    v-on:click="getPenRTC">
                                    获取时钟
                                </button>
                            </th>
                            <th>
                                <button
                                    id="setPenRTC"
                                    :disabled="functionDisabled"
                                    v-on:click="setPenRTC">
                                    设置时钟
                                </button>
                            </th>
                            <th>
                                <button
                                    id="getPowerOffTime"
                                    :disabled="functionDisabled"
                                    v-on:click="getPowerOffTime">
                                    获取关机时间
                                </button>
                            </th>
                            <th>
                                <button
                                    id="setPowerOffTime"
                                    :disabled="functionDisabled"
                                    v-on:click="setPowerOffTime">
                                    设置关机时间
                                </button>
                            </th>
                            <th>
                                <button
                                    id="offlineinfo"
                                    :disabled="functionDisabled"
                                    v-on:click="getOfflineDataInfo">
                                    离线数据信息
                                </button>
                            </th>
                            <th>
                                <button
                                    id="clearofflinedata"
                                    :disabled="functionDisabled"
                                    v-on:click="clearOfflineData">
                                    清空离线数据
                                </button>
                            </th>
                        </tr>
                    </table>
                </div>
            </div>
            <div style="clear: both">
                <div id="rawMsg" v-text="rawResult"></div>
            </div>
            <div id="status">
                <div class="item">
                    <div class="lable">连接状态：</div>
                    <div
                        class="info"
                        id="penconnstatus"
                        v-text="connectionStatus"></div>
                </div>
                <div class="item">
                    <div class="lable">设备名：</div>
                    <div class="info" id="penserial" v-text="penName"></div>
                </div>
                <div class="item">
                    <div class="lable">笔序列号：</div>
                    <div class="info" id="penserial" v-text="penSerial"></div>
                </div>
                <div class="item">
                    <div class="lable">书写状态：</div>
                    <div class="info" id="penstatus" v-text="writeStatus"></div>
                </div>
                <div class="item">
                    <div class="lable">输出坐标：</div>
                    <div class="info" id="pencoor" v-text="coorInfo"></div>
                </div>
            </div>
            <div
                id="content"
                style="
                    width: 100%;
                    min-width: 1000px;
                    height: 1414px;
                    background: rgb(60, 60, 60);
                ">
                <div
                    style="
                        margin: 0 auto;
                        width: 1000px;
                        min-width: 1000px;
                        height: 1414px;
                        background-color: rgb(37, 37, 38);
                    "></div>
                <div
                    style="
                        width: 1000px;
                        position: relative;
                        top: -1414px;
                        margin: 0 auto;
                    ">
                    <canvas
                        id="myCanvas"
                        style="width: 1000px; height: 1414px"
                        width="1000"
                        height="1414"></canvas>
                </div>
            </div>
        </div>
        <!-- <script src='app.js'>
		</script> -->
        <div id="footer">Copyright@2020 北京拓思德科技有限公司</div>
    </div>
    <!-- <script src='tstudy-digital-pen-web.js'></script> -->
</template>


<script>
import { ComponentKey , ConnectStatus } from "@/utils/Definition";
import { license, signature } from "../driver/MyLicense";
import TStudyDigitalPen from "../driver/PenDriver.js";
export default {
    name: 'DrawView',
    inject: [ComponentKey.Dotpen],
    data() {
        console.log("in DrawView");
        console.log(this[ComponentKey.Dotpen])
        return {
            Dotpen:this[ComponentKey.Dotpen],
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
        };
    },
    methods: {
        scanAndConnect: function (_) {
            this.Dotpen.$ConnectStatus = ConnectStatus.Connecting;
            TStudyDigitalPen.getInstance().loadLicense(license, signature);
            TStudyDigitalPen.getInstance().setCallbackDelegate(
                this.callbacks()
            );
            TStudyDigitalPen.getInstance().scanAndConnectPen()
                .then((ret) => {
                    if (ret) {
                        this.Dotpen.$ConnectStatus = ConnectStatus.Connected;
                        console.log("--连接成功--");
                        TStudyDigitalPen.getInstance()
                            .getPenInfo()
                            .then(() => {
                                TStudyDigitalPen.getInstance().getPenMACAddress();
                            });
                    }
                })
                .catch((error) => {
                    this.rawResult = error.toString();
                });
        },
        checkWebBluetooth: function (_) {
            TStudyDigitalPen.getInstance()
                .checkWebBluetoothAvailability()
                .then((result) => {
                    console.log(result);
                    this.rawResult = JSON.stringify(result);
                });
        },
        disconnect: function (_) {
            TStudyDigitalPen.getInstance().disconnectPen();
            this.functionDisabled = true;
            this.scannDisabled = false;
            this.Dotpen.$ConnectStatus = ConnectStatus.Disconnected;
        },
        startReceiveStroke: function (_) {
            console.log("startReceiveStroke  pen.app.js");
            TStudyDigitalPen.getInstance().startReceiveStroke();
        },
        stopReceiveStroke: function (_) {
            TStudyDigitalPen.getInstance().stopReceiveStroke();
        },
        receiveRealtimeMode: function (_) {
            TStudyDigitalPen.getInstance().receiveRealtimeMode();
        },
        receiveStorageMode: function (_) {
            TStudyDigitalPen.getInstance().receiveStorageMode();
        },
        getPenInfo: function (_) {
            TStudyDigitalPen.getInstance().getPenInfo();
        },
        getBatteryInfo: function (_) {
            TStudyDigitalPen.getInstance().getPenBatteryInfo();
        },
        hoverOn: function (_) {
            TStudyDigitalPen.getInstance().setHoverMode(true);
        },
        hoverOff: function (_) {
            TStudyDigitalPen.getInstance().setHoverMode(false);
        },
        getMac: function (_) {
            TStudyDigitalPen.getInstance().getPenMACAddress();
        },
        getPenRTC: function (_) {
            TStudyDigitalPen.getInstance().getPenRTC();
        },
        setPenRTC: function (_) {
            let timestamp = new Date().getTime();
            TStudyDigitalPen.getInstance().setPenRTC(timestamp);
        },
        getPowerOffTime: function (_) {
            TStudyDigitalPen.getInstance().getPowerOffTime();
        },
        setPowerOffTime: function (_) {
            let minute = 45;
            TStudyDigitalPen.getInstance().setPowerOffTime(minute);
        },
        getOfflineDataInfo: function (_) {
            TStudyDigitalPen.getInstance().getPenOfflineDataSize();
        },
        clearOfflineData: function (_) {
            TStudyDigitalPen.getInstance().clearPenOfflineData();
        },
        drawStrokeDynamic: function (pt, tension) {
            let can = document.getElementById("myCanvas");
            let ctx = can.getContext("2d");
            if (this.lastPt == null) {
                this.lastPt = pt;
            } else {
                ctx.beginPath();
                ctx.moveTo(this.lastPt.x, this.lastPt.y);

                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "rgb(199,116,99)"; // "#000"
                ctx.fillStyle = "rgb(0,0,255)";
                let controlPt = {};
                let control_scale = (tension / 0.5) * 0.175;
                controlPt.x =
                    this.lastPt.x + (pt.x - this.lastPt.x) * control_scale;
                controlPt.y =
                    this.lastPt.y + (pt.y - this.lastPt.y) * control_scale;
                ctx.quadraticCurveTo(controlPt.x, controlPt.y, pt.x, pt.y);
                this.lastPt = pt;
                ctx.stroke();

                ctx.stroke();
                ctx.closePath();
            }
        },
        drawStrokeLine: function (lineStroke) {
            var pointLen = lineStroke.length;
            if (pointLen === 2) {
            } else {
                var pt = [];
                var can = document.getElementById("myCanvas");
                var ctx = can.getContext("2d");

                ctx.lineJoin = "round";
                ctx.lineWidth = 2;
                ctx.strokeStyle = "#000";
                ctx.fillStyle = "rgb(0,0,255)";

                ctx.beginPath();
                for (var i = 0; i < pointLen - 2; i++) {
                    if (i == 0) {
                        pt.startX = lineStroke[i].x;
                        pt.startY = lineStroke[i].y;

                        pt.controlX = lineStroke[i + 1].x;
                        pt.controlY = lineStroke[i + 1].y;

                        pt.endX =
                            (lineStroke[i + 1].x + lineStroke[i + 2].x) / 2;
                        pt.endX =
                            (lineStroke[i + 1].y + lineStroke[i + 2].y) / 2;

                        ctx.moveTo(pt.startX, pt.startY);
                    } else {
                        pt.startX = pt.endX;
                        pt.startY = pt.endY;

                        pt.controlX = lineStroke[i + 1].x;
                        pt.controlY = lineStroke[i + 1].y;

                        if (i === pointLen - 2 - 1) {
                            pt.endX = lineStroke[i + 2].x;
                            pt.endY = lineStroke[i + 2].y;
                        } else {
                            pt.endX =
                                (lineStroke[i + 1].x + lineStroke[i + 2].x) / 2;
                            pt.endY =
                                (lineStroke[i + 1].y + lineStroke[i + 2].y) / 2;
                        }
                    }

                    ctx.quadraticCurveTo(
                        pt.controlX,
                        pt.controlY,
                        pt.endX,
                        pt.endY
                    );
                }
                ctx.stroke();
                ctx.closePath();
            }
            lineStroke = [];
        },
        clearDrawing: function () {
            let can = document.getElementById("myCanvas");
            can.height = can.height;
        },
        callbacks: function () {
            var vueapp = this;
            return {
                onPenConnectionStateChange: function ({ name, connect }) {
                    console.log("onPenConnectionStateChange: ", name, connect);
                    vueapp.connectionStatus = `${
                        connect ? "已连接" : "未连接"
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
    },
};
</script>

<style>
.close {
    opacity: 0;
}

.close:hover {
    opacity: 1;
    transition-duration: 0.25s;
    transition-delay: 0.25s;
}

[v-cloak] {
    display: none;
}

.lable {
    float: left;
    color: rgb(123, 220, 254);
    margin-left: 10px;
    margin-top: 5px;
}

.info {
    float: left;
    color: rgb(181, 173, 97);
    margin-top: 5px;
}

.item {
    clear: both;
}

#log {
    margin-left: 10px;
}

#status {
    float: left;
}

#footer {
    text-align: center;
    clear: both;
}

#container {
    width: 100%;
    min-width: 1000px;
}

button {
    width: 100px;
    margin-right: 10px;
    text-align: center;
    background-color: #4e6ef2;
    border-radius: 5px;
    outline: 0 none;
    height: 35px;
    color: white;
    border: none;
}

button:disabled {
    color: lightgray;
    background-color: #4e6ef2;
}

button:hover {
    background-color: #2951f3;
}

button:hover:disabled {
    background-color: #4e6ef2;
}

button:active {
    background-color: #0934df;
}

tr {
    height: 38px;
}

#operation {
    background-color: rgb(60, 60, 60);
    border-radius: 10px;
    margin-bottom: 1px;

    padding: 10px;
}

#rawMsg {
    height: 40px;
    background-color: rgb(60, 60, 60);
    color: rgb(199, 116, 99);
    line-height: 40px;
    padding-left: 10px;
    border-radius: 10px 10px 0px 0px;
}

#title {
    background-color: rgb(60, 60, 60);
    border-radius: 10px 10px 10px 10px;
    margin-bottom: 0.5px;
    color: rgb(191, 191, 191);
    height: 50px;
    line-height: 50px;

    font-size: 20px;
    width: 100%;
    min-width: 1000px;
}
</style>
