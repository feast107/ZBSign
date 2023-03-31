<template>
    <div id="PlayMain">
        <div id="Foreground">
            <el-container id="Container">
                <el-header style="height: 20%">
                    <el-row>
                        <el-col :span="3">
                            <el-image v-if="activity.HasLogo" class="logo" fit="cover" :src="activity.logoUrl" />
                        </el-col>
                        <el-col :span="21">
                            <el-row>
                                <label class="title" id="MainTitle"
                                    :style="`color:${activity.titleColor};font-size:${activity.titleSize}px;font-family:ForActivity;`">
                                    {{ activity.title }}
                                </label>
                            </el-row>
                            <el-row v-if="activity.HasSubTitle">
                                <label class="title" id="SubTitle" :style="`color:${activity.titleColor
                                    };font-size:${activity.titleSize / 1.5
                                    }px;font-family:ForActivity;`">
                                    {{ activity.subTitle }}
                                </label>
                            </el-row>
                        </el-col>
                    </el-row>
                </el-header>
                <el-container style="height: 75%">
                    <el-aside style="width: 40%">
                        <div id="PictureBorder">
                            <el-image fit="fill" style="
                                            left: 0;
                                            position: absolute;
                                            width: 100%;
                                            height: 100%;
                                        " :src="activity.leftBorder"></el-image>
                            <div id="Pictures">
                                <ul>
                                    <li v-for="url in activity.pictureUrls" :key="url">
                                        <img :src="url" />
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </el-aside>
                    <el-main style="width: 60%">
                        <div id="MainWindow" style="
                                        position: relative;
                                        background-color: transparent;
                                        overflow: hidden;
                                        width: 100%;
                                        height: 100%;
                                    ">
                            <Container :key="key" v-for="key in Object.keys(locals)" :canvas="locals[key]"></Container>
                            <Container :key="key" v-for="key in Object.keys(remotes)" :canvas="remotes[key]"></Container>
                        </div>
                    </el-main>
                </el-container>
                <el-footer style="height: 5%; text-align: end">
                    <label style="
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
        <el-image id="Background" fit="fill" style="width: 100%; height: 100%; z-index: 0" :src="activity.backgroundUrl">
        </el-image>
    </div>
</template>

<script>
import "animate.css";
import { Animation, EndlessPlayer } from "@/utils/Animation";
import { ComponentKey, Dotpen, IpcMessage, Handlers } from "@/utils/Definition";
import { ResizeEvent } from "@/utils/Events";
import { Canvas, Dot } from "@/utils/Canvas";
import { Stroke, StrokeDivider } from "@/utils/Stroke";
import Container from "./Container.vue";
import { Activity } from "@/utils/Activity";
export default {
    components: {
        Container,
    },
    beforeCreate() {
        window.$Dispatcher.invoke(IpcMessage.FullScreen, true);
    },
    unmounted() {
        this.player.stop();
        this.stopScroll();
        clearInterval(this.intervals.queryInterval);
        this.getCanvases().forEach((x) => {
            x.stopUpload();
        });
        window.$Dispatcher.invoke(IpcMessage.FullScreen, false);
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
                queryInterval: null,
            },
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
            /**
             * @type {Array<StrokeDivider>}
             */
            strokeDividers: {},
            diverSize: {},
            /**
             * @type {EndlessPlayer}
             */
            player: null,
        };
    },
    created() {
        var vue = this;
        this.loadFont("ForActivity", this.activity.font);
        this.startQuery();
        document.addEventListener("keyup", (e) => {
            if (e.key == "Escape") {
                vue.$emit(Handlers.QuitPlay, null);
            }
        });
        ResizeEvent.on((width, height) => { });
        this.dotpen.onDraw(this.callbackHandler());

        let effects = this.activity.rollEffect.split(".");
        this.stylePair = Animation.getOpposite(effects[0], effects[1]);

        this.player = new EndlessPlayer(this.getCanvases)
            .bySeconds(this.activity.SignSpeed)
            .whenElementIn((e) => {
                e.show();
                e.className = `canvas ${this.stylePair[1]}`;
                e.trigger(null);
            })
            .whenElementOut((e) => {
                e.show();
                e.className = `canvas ${this.stylePair[0]}`;
            })
            .beforeRound(() => {
                this.hideAll();
            })
            .afterAll(() => {
                this.getCanvases().forEach((x) => (x.className = "canvas"));
            });
    },
    mounted() {
        this.scrollImage(this.activity.PictureSpeed);
        let vue = this;
        setTimeout(() => {
            vue.player.start();
            vue.hideAll();
        }, 3000);
    },
    methods: {
        startQuery() {
            if (this.intervals.queryInterval) return;
            this.intervals.queryInterval = setInterval(async () => {
                //查询已经绘制的页面
                let pages = await this.activity.queryWrittenPages();
                if (!pages.Success) {
                    return;
                }
                this.setPage(pages.data);
            }, 3000);
        },
        setPage(pages) {
            pages.forEach(async (page) => {
                //判断是否已经处理过该页
                if (this.strokeDividers[page]) return;
                let promise = await this.activity.queryStrokes(page);
                if (!promise.Success) return;
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
                    if (!this.activity.isValidDot(dot)) {
                        console.log(`[${dot.address}]无效`)
                        return;
                    }
                    clearTimeout(laterInterval);
                    vue.player.stop();
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
                        vue.player.play();
                    }, 5000);
                }
            };
            return del;
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
            .el-col {
                height: 100%;
            }
        }

        .logo {
            height: 66.6%;
        }

        #Container {
            margin: 25px;
            height: calc(100% - 50px);
            width: calc(100% - 50px);

            .title {
                font-weight: 1000;
                margin: 0 !important;
                height: 100%;
                width: 100%;
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

            .el-aside {
                overflow: hidden;

                #PictureBorder {
                    height: 100%;
                    width: 100%;
                    position: relative;
                    overflow: hidden;
                    background-size: cover;
                    background-repeat: no-repeat;

                    #Pictures {
                        margin-top: 40px;
                        margin-top: 40px;
                        margin-left: 80px;
                        margin-right: 80px;
                        height: calc(100% - 80px);
                        width: calc(100% - 160px);
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
