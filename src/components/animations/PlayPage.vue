<template>
    <div id="PlayMain">
        <div id="Foreground">
            <el-container id="Container">
                <el-header style="height: 20%">
                    <el-row>
                        <el-col :span="3">
                            <img class="logo" :src="this.activity.logoUrl" />
                        </el-col>
                        <el-col :span="21">
                            <label
                                class="title"
                                :style="`color:${this.activity.titleColor};font-size:${this.fontSize}px`">
                                {{ this.activity.title }}
                            </label>
                        </el-col>
                    </el-row>
                </el-header>
                <el-container style="height: 75%">
                    <el-aside style="width: 40%; padding: 20px">
                        <div id="Pictures">
                            <ul>
                                <li v-for="url in this.urls" :key="url">
                                    <img :src="url" />
                                </li>
                            </ul>
                        </div>
                    </el-aside>
                    <el-main style="width: 60%">
                        <div
                            style="
                                background-color : white;
                                width: 100%;
                                height: 100%;
                            ">
                            <canvas
                                id="Drawer"
                                :width="this.drawWidth * this.scale"
                                :height="this.drawHeight * this.scale">
                            </canvas>
                        </div>
                    </el-main>
                </el-container>
                <el-footer style="height: 5%; text-align: end">
                    <label
                        style="
                            color: white;
                            font-family: 'Helvetica Neue', Helvetica,
                                'PingFang SC', 'Hiragino Sans GB',
                                'Microsoft YaHei', '微软雅黑', Arial, sans-serif;
                        ">
                        技术支持：南京孜博汇信息科技有限公司
                    </label>
                </el-footer>
            </el-container>
        </div>
        <div id="Background"></div>
    </div>
</template>

<script>
import "animate.css";
import { Animation } from "@/utils/Animation";
import { ComponentKey, Dotpen, IpcMessage } from "@/utils/Definition";
import { ResizeEvent } from "@/utils/Events";
export default {
    beforeCreate() {
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    unmounted() {
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    inject: [ComponentKey.PlayActicity, ComponentKey.Dotpen],
    data() {
        return {
            /**
             * @param {Dotpen}
             */
            dotpen: this[ComponentKey.Dotpen],
            canvas: document.getElementById("Drawer"),
            activity: this[ComponentKey.PlayActicity],
            stylePair: Animation.getOpposite("fade", "Up"),
            index: 0,
            interval: null,
            fontSize: 40,
            pictures: [],
            dotwdith: 5600,
            dotheight: 7920,
            drawWidth: 960,
            drawHeight: 360,
            drawConfig: {
                lineWidth: 0.5,
                lineJoin: "round",
                lineCap: "round",
                drawCount: 2,
            },
            urls: [this.getUrl(1), this.getUrl(2), this.getUrl(3)],
            scale: 1.5,
        };
    },
    created() {
        this.canvas ??= document.getElementById("Drawer");
        var vue = this;
        document.addEventListener("keyup", (e) => {
            if (e.key == "Escape") {
                vue.$emit("onEscapePreview", null);
            }
        });
        this.activity.logoUrl = this.getLogo();
        window.StylePair = this.stylePair;
        window.Animations = Animation;
        ResizeEvent.on((width, height) => {
            console.log(`${width}   ${height}`);
        });
        this.dotpen.onDraw(this.callbackHandler());
        window.drawConfig = this.drawConfig;
    },
    mounted() {
        this.scrollImage(20);
        this.canvas = document.getElementById("Drawer");
    },
    methods: {
        scaleDot(dot) {
            if (dot.x) {
                var x =
                    (this.canvas.clientWidth / this.dotwdith) *
                    dot.x *
                    this.scale;
                var y =
                    (this.canvas.clientHeight / this.dotheight) *
                    dot.y *
                    this.scale;
                dot.x = x;
                dot.y = y;
            }
            return dot;
        },
        initContext(context) {
            context.lineJoin = this.drawConfig.lineJoin;
            context.lineWidth = this.drawConfig.lineWidth * vue.scale;
            context.lineCap = this.drawConfig.lineCap;
            context.strokeStyle = "rgb(0,0,0)"; // "#000"
            context.fillStyle = "rgb(0,0,255)";
            return context;
        },
        callbackHandler() {
            var vue = this;
            return (dot) => {
                let ctx = vue.canvas.getContext("2d");
                vue.scaleDot(dot);
                console.log(dot);
                switch (dot.type) {
                    case "up":
                        this.lastPt = null;
                        return;
                    case "down":
                        return;
                }
                if (this.lastPt == null) {
                    this.lastPt = dot;
                } else {
                    ctx.beginPath();
                    ctx.moveTo(this.lastPt.x, this.lastPt.y);
                    vue.initContext(ctx);
                    let controlPt = {};
                    let control_scale = (0.8 / 0.5) * 0.175;
                    controlPt.x =
                        this.lastPt.x + (dot.x - this.lastPt.x) * control_scale;
                    controlPt.y =
                        this.lastPt.y + (dot.y - this.lastPt.y) * control_scale;
                    ctx.quadraticCurveTo(
                        controlPt.x,
                        controlPt.y,
                        dot.x,
                        dot.y
                    );
                    this.lastPt = dot;
                    var t = 0;
                    while (t < vue.drawConfig.drawCount) {
                        ctx.stroke();
                        t++;
                    }

                    ctx.closePath();
                }
            };
        },
        onReceiveDot(dot, canvas) {
            console.log(dot);
            console.log(canvas);
            let ctx = canvas.getContext("2d");
            debugger;
            if (this.lastPt == null) {
                this.lastPt = dot;
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
        getUrl: (num) => `http://47.93.86.37:8686/taskFile/sign/${num}.JPG`,
        getLogo: (num) => `http://47.93.86.37:8686/taskFile/sign/logo.png`,
        animate(feature) {
            this.stylePair = Animation.getOpposite(feature, "Up");
        },
        playImage(timeout) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            let pictures = document.querySelectorAll(".item");
            let nextImage = () => {
                pictures[this.index].className = this.stylePair[1]; //当前图片淡出
                this.index++;
                this.index = this.index % pictures.length;
                pictures[this.index].className = this.stylePair[0]; //下一张图片淡出
            };
            this.interval = setInterval(nextImage, timeout * 1000);
        },
        scrollImage(timeout) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            var iSpeed = -1;
            let cont = document.getElementById("Pictures");
            let ul = cont.getElementsByTagName("ul")[0];
            ul.innerHTML += ul.innerHTML;
            let scroll = () => {
                ul.style.top = `${ul.offsetTop + iSpeed}px`;
                if (ul.offsetTop < -ul.offsetHeight / 2) {
                    ul.style.top = "0px";
                } else if (ul.offsetTop > 0) {
                    ul.style.top = `${-ul.offsetHeight / 2}px`;
                }
            };
            this.interval = setInterval(scroll, timeout);
        },
    },
};
</script>

<style lang="scss">
#PlayMain {
    height: 100%;
    width: 100%;
    overflow: hidden;

    #Foreground {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 0 !important;
        height: 100%;
        width: 100%;

        .el-row {
            height: 100%;

            .el-col {
                height: 100%;
            }
        }

        .logo {
            height: 66.6%;
        }

        #Container {
            margin: 50px;
            height: calc(100% - 100px);
            width: calc(100% - 100px);

            .title {
                font-weight: 1000;
                margin: 0 !important;
                height: 100%;
                user-select: none;
                letter-spacing: 10px;
                pointer-events: none;
                vertical-align: middle;
                text-overflow: ellipsis;
                display: -webkit-box;
                -webkit-box-orient: vertical;
                -webkit-line-clamp: 1;
                word-break: break-all;
                white-space: nowrap;
                line-height: 200%;
            }

            #Pictures {
                padding: 0;
                height: 100%;
                width: 100%;
                position: relative;
                overflow: hidden;

                li {
                    background-size: cover;
                    background-repeat: no-repeat;
                    user-select: none;
                }

                ul {
                    position: absolute;
                    left: 0;
                    margin: 0;
                }

                ul li {
                    list-style: none;
                    float: left;
                }

                ul li img {
                    width: 100%;
                }
            }

            #Drawer {
                height: 100%;
                width: 100%;
            }

            label {
                user-select: none;
            }
        }
    }

    #Background {
        position: static;
        left: 0;
        top: 0;
        z-index: 1 !important;
        height: 100%;
        width: 100%;
        background-image: url(../../assets/Play/RadiantBackground.jpg);
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }
}
</style>
