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
                                id="MainTitle"
                                :style="`color:${activity.titleColor};
                                                                                                                                                                                                                                                                                                                                                                                                    font-size:${this.fontSize}px;font-family:ForActivity;`"
                            >
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
                                    :key="url"
                                >
                                    <img :src="url" />
                                </li>
                            </ul>
                        </div>
                    </el-aside>
                    <el-main style="width: 60%">
                        <div
                            id="MainWindow"
                            style="
                                position: relative;
                                background-color: transparent;
                                overflow: hidden;
                                width: 100%;
                                height: 100%;
                            "
                        >
                            <div
                                :key="key"
                                v-for="key in Object.keys(locals)"
                                :style="`display:${locals[key].display};background-image:url(${activity.border}); `"
                                :class="locals[key].className"
                            >
                                <canvas
                                    :id="locals[key].id"
                                    :z-index="locals[key].index"
                                    class="canvasBody"
                                    :style="`display:${locals[key].display};background-image:url(${activity.pageUrl})`"
                                    :width="locals[key].drawWidth"
                                    :height="locals[key].drawHeight"
                                >
                                </canvas>
                            </div>
                            <div
                                :key="key"
                                v-for="key in Object.keys(remotes)"
                                :style="`display:${remotes[key].display};background-image:url(${activity.border});`"
                                :class="remotes[key].className"
                            >
                                <canvas
                                    :id="remotes[key].id"
                                    class="canvasBody"
                                    :style="`display:${remotes[key].display};background-image:url(${activity.pageUrl})`"
                                    :width="remotes[key].drawWidth"
                                    :height="remotes[key].drawHeight"
                                >
                                </canvas>
                            </div>
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
                        "
                    >
                        技术支持：南京孜博汇信息科技有限公司
                    </label>
                </el-footer>
            </el-container>
        </div>
        <el-image
            id="Background"
            fit="fill"
            style="width: 100%; height: 100%; z-index: 0"
            :src="activity.backgroundUrl"
        >
        </el-image>
    </div>
</template>

<script>
import "animate.css";
import { Animation } from "@/utils/Animation";
import { ComponentKey, Dotpen, IpcMessage } from "@/utils/Definition";
import { ResizeEvent } from "@/utils/Events";
import { Canvas, Dot, Stroke, StrokeDivider } from "@/utils/Canvas";
import { Activity } from "@/utils/Activity";
export default {
    beforeCreate() {
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    unmounted() {
        this.stopPlay();
        this.stopScroll();
        clearInterval(this.intervals.queryInterval);
        Object.keys(this.strokeDividers).forEach((x) => {
            this.strokeDividers[x].stopQuery();
        });
        this.getCanvases().forEach((x) => {
            x.stopUpload();
        });
        window.$Dispatcher.invoke(IpcMessage.FullScreen);
    },
    inject: [ComponentKey.PlayActicity, ComponentKey.Dotpen],
    data() {
        return {
            pad: 10,
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
            fontSize: 70,
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
            strokeDividers: {},
            diverSize: {},
        };
    },
    created() {
        var vue = this;
        this.loadFont("ForActivity", this.activity.font);
        this.intervals.queryInterval = setInterval(async () => {
            //查询已经绘制的页面
            let pages = await this.activity.queryWrittenPages();
            if (!pages.Success) { return; }
            this.setPage(pages.data);
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
            vue.playImage(this.activity.Speed);
        }, 500);
        let effects = this.activity.rollEffect.split(".");
        this.stylePair = Animation.getOpposite(effects[0], effects[1]);
    },
    mounted() {
        this.scrollImage(20);
    },
    methods: {
        margin() {
            return `${this.pad}px`;
        },
        calc() {
            return `calc(100% - ${this.pad * 2}%)`;
        },
        setPage(pages) {
            pages.forEach(async (page) => {
                //判断是否已经处理过该页
                if (this.strokeDividers[page]) return;
                let promise = await this.activity.queryStroke(page);
                debugger;
                if(!promise.Success)return;
                //获取点阵地址
                var addr = this.activity.getPageAddress(page);
                /**
                 * @type {Array<Stroke>}
                 */
                let strokes = promise.data;
                let divider = new StrokeDivider(
                    page,
                    addr,
                    strokes,
                    this.activity,
                    this.dotpen.$Name,
                    this.locals,
                    this.remotes
                );
                divider.accecptStrokes(strokes);
                divider.pollQuery();
                this.strokeDividers[page] = divider;
            });
        },
        async loadFont(family, url) {
            const font = new FontFace(family, `url(${url})`);
            await font.load();
            document.fonts.add(font);
        },
        showAll() {
            this.getCanvases().forEach((x) => x.show());
        },
        hideAll() {
            this.getCanvases().forEach((x) => x.hide());
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
                        c.uploadInterval(vue.activity.id);
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
                        vue.playImage(this.activity.Speed);
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
        getCanvases() {
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
                var pic = this.getCanvases();
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
                this.getCanvases().forEach((x) => (x.className = "canvas"));
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
#MainTitle {
    font-family: "ForActivity";
}

#PlayMain {
    height: 100%;
    width: 100%;
    overflow: hidden;

    #Foreground {
        position: fixed;
        left: 0;
        top: 0;
        z-index: 10 !important;
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
                width: 100%;
                height: 100%;
                left: 0;
                position: absolute;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
                z-index: 10 !important;
            }

            .canvasBody {
                width: calc(100% - 100px);
                height: calc(100% - 100px);
                margin: 50px;
                background-size: cover;
                background-repeat: no-repeat;
                background-position: center;
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
        background-color: black;
        background-image: url(../../assets/Play/RadiantBackground.jpg);
        background-size: contain;
        background-repeat: no-repeat;
        background-position: center;
    }
}
</style>
