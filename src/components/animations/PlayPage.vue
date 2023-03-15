<template>
    <div id="PlayMain">
        <div id="Foreground">
            <el-container id="Container">
                <el-header style="height: 20%">
                    <el-row>
                        <el-col :span="3">
                            <img class="logo" :src="activity.logoUrl" />
                        </el-col>
                        <el-col :span="21">
                            <label
                                class="title"
                                :style="`color:${activity.titleColor};font-size:${this.fontSize}px`">
                                {{ activity.title }}
                            </label>
                        </el-col>
                    </el-row>
                </el-header>
                <el-container style="height: 75%">
                    <el-aside style="width: 40%; padding: 20px">
                        <div id="Pictures">
                            <ul>
                                <li
                                    v-for="url in activity.pictureUrls"
                                    :key="url">
                                    <img :src="url" />
                                </li>
                            </ul>
                        </div>
                    </el-aside>
                    <el-main style="width: 60%">
                        <div
                            style="
                                position: relative;
                                background-color: transparent;
                                overflow: hidden;
                                width: 100%;
                                height: 100%;
                            ">
                            <canvas
                                v-for="key in Object.keys(locals)"
                                :key="key"
                                :id="locals[key].id"
                                :class="locals[key].className"
                                :z-index="locals[key].index"
                                :style="`background-color:white;display:${locals[key].display}`"
                                :width="locals[key].drawWidth"
                                :height="locals[key].drawHeight">
                            </canvas>
                            <canvas
                                v-for="key in Object.keys(remotes)"
                                :key="key"
                                :id="remotes[key].id"
                                :class="remotes[key].className"
                                :style="`background-color:white;display:${remotes[key].display}`"
                                :width="remotes[key].drawWidth"
                                :height="remotes[key].drawHeight">
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
import { Canvas, Dot, Stroke } from "@/utils/Canvas";
import { Activity } from "@/utils/Activity";
export default {
    beforeCreate() {
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    unmounted() {
        this.stopPlay();
        this.stopScroll();
        clearInterval(this.intervals.queryInterval);
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    inject: [ComponentKey.PlayActicity, ComponentKey.Dotpen],
    data() {
        return {
            /**
             * @type {Dotpen}
             */
            dotpen: this[ComponentKey.Dotpen],
            /**
             * @type {Activity}
             */
            activity: this[ComponentKey.PlayActicity],
            stylePair: Animation.getOpposite("fade", "Right"),
            index: 0,
            intervals: {
                scrollInterval: null,
                playInterval: null,
                queryInterval: null,
            },
            fontSize: 40,
            pictures: [],
            /**
             * @type {Canvas}
             */
            current: null,
            /**
             * @type {Object<Canvas>}
             */
            locals: {},
            /**
             * @type {Object<Canvas>}
             */
            remotes: {},
            pageNums: [],
        };
    },
    created() {
        var vue = this;
        console.log(this.activity.queryWrittenPages());
        this.intervals.queryInterval = setInterval(() => {
            this.activity
                .queryWrittenPages()
                .then((r) => {
                    /**
                     * @type {Array<Number>}
                     */
                    let list = r.data.data;
                    list.forEach((x) => {
                        if (this.pageNums.findIndex((i) => i == x) >= 0) {
                            return;
                        }
                        this.pageNums.push(x);
                        this.activity
                            .queryStroke(x)
                            .then((r) => {
                                console.log(r);
                                var addr = this.activity.getPageAddress(x);
                                if (this.locals[addr]) {
                                    return;
                                }
                                var can = new Canvas(
                                    null,
                                    null,
                                    true,
                                    addr,
                                    null,
                                    vue.dotpen.$Name,
                                    x
                                );
                                this.remotes[x] = can;
                                setTimeout(() => {
                                    can.bind(document);
                                    r.data.data.forEach((stroke) => {
                                        can.draw(Dot.Up);
                                        Stroke.SVG2Points(
                                            stroke.p,
                                            addr
                                        ).forEach((dot) => {
                                            can.draw(dot);
                                        });
                                        can.draw(Dot.Up);
                                    });
                                }, 100);
                            })
                            .catch((r) => {
                                console.log(r);
                            });
                    });
                })
                .catch((e) => {});
        }, 3000);
        document.addEventListener("keyup", (e) => {
            if (e.key == "Escape") {
                vue.$emit("onEscapePreview", null);
            }
        });
        ResizeEvent.on((width, height) => {});
        this.dotpen.onDraw(this.callbackHandler());
        window.locals = this.locals;
        setTimeout(() => {
            vue.playImage(2);
        }, 500);
    },
    mounted() {
        this.scrollImage(20);
    },
    methods: {
        showAll() {
            Object.keys(this.locals).forEach((x) => this.locals[x].show());
        },
        hideAll() {
            Object.keys(this.locals).forEach((x) => this.locals[x].hide());
        },
        callbackHandler() {
            var vue = this;
            /**
             * @param {Dot} dot
             */
            let createFromLocal = (dot) => {
                /**
                 * @type {Canvas}
                 */
                let c = vue.locals[dot.address];
                if (!c) {
                    c = vue.locals[dot.address] = new Canvas(
                        null,
                        null,
                        false,
                        dot.address,
                        2,
                        vue.dotpen.$Name,
                        vue.activity.getPageNum(dot.address)
                    );
                    setTimeout(() => {
                        c.bind(document);
                        setInterval(() => {
                            c.uploadStroke(this.activity.id)
                                .then((r) => console.log(r))
                                .catch((e) => {
                                    console.log(e);
                                });
                        }, 3000);
                    }, 0);
                }
                return c;
            };
            let laterInterval = 0;
            /**
             * @param {Dot} dot
             */
            var del = (dot) => {
                if (!dot.IsMove) {
                    if (vue.current) {
                        vue.current.draw(dot);
                    }
                } else {
                    clearTimeout(laterInterval);
                    vue.stopPlay();
                    if (
                        vue.current == null ||
                        vue.current.address != dot.address
                    ) {
                        vue.current = createFromLocal(dot);
                    }
                    vue.hideAll();
                    vue.current.draw(dot);
                    vue.current.show();
                    laterInterval = setTimeout(() => {
                        vue.showAll();
                        vue.playImage(2);
                    }, 5000);
                }
            };
            return del;
        },
        animate(feature) {
            this.stylePair = Animation.getOpposite(feature, "Up");
        },
        /**
         * @return {Canvas[]}
         */
        getPictures() {
            var ret = [];
            Object.keys(this.locals).forEach((x) => ret.push(this.locals[x]));
            Object.keys(this.remotes).forEach((x) => ret.push(this.remotes[x]));
            return ret;
        },
        playImage(timeout) {
            this.stopPlay();
            /**
             * @return {Canvas[]}
             */
            let nextImage = () => {
                var pic = this.getPictures();
                if (pic.length > 1) {
                    pic[this.index].className = `canvas ${this.stylePair[1]}`; //当前图片淡出
                    this.index++;
                    this.index = this.index % pic.length;
                    pic[this.index].className = `canvas ${this.stylePair[0]}`; //下一张图片淡出
                }
            };
            this.intervals.playInterval = setInterval(
                nextImage,
                timeout * 1000
            );
        },
        stopPlay() {
            if (this.intervals.playInterval) {
                clearInterval(this.intervals.playInterval);
                this.intervals.playInterval = null;
                this.getPictures().forEach((x) => (x.className = "canvas"));
            }
        },
        scrollImage(timeout) {
            this.stopScroll();
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
            this.intervals.scrollInterval = setInterval(scroll, timeout);
        },
        stopScroll() {
            if (this.intervals.scrollInterval) {
                clearInterval(this.intervals.scrollInterval);
                this.intervals.scrollInterval = null;
            }
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
                    padding: 0;
                }

                ul li {
                    list-style: none;
                    float: left;
                }

                ul li img {
                    width: 100%;
                }
            }

            .canvas {
                height: 100%;
                width: 100%;
                left: 0;
                position: absolute;
            }

            .front {
                height: 100%;
                width: 100%;
                left: 0;
                position: absolute;
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
