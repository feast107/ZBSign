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
                                background-color: white;
                                width: 100%;
                                height: 100%;
                            ">
                            <canvas>
                                
                            </canvas></div>
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
import { ComponentKey } from "@/utils/Definition";
import { ResizeEvent } from "@/utils/Events";
export default {
    beforeCreate() {
        
    },
    inject: [ComponentKey.PlayActicity],
    data() {
        return {
            activity: this[ComponentKey.PlayActicity],
            stylePair: Animation.getOpposite("fade", "Up"),
            index: 0,
            interval: null,
            fontSize: 40,
            pictures: [],
            urls: [this.getUrl(1), this.getUrl(2), this.getUrl(3)],
        };
    },
    created() {
        var vue = this;
        document.addEventListener("keyup",  (e) => {
            if(e.key == "Escape"){
                vue.$emit('onEscapePreview',null);
            }
        });
        this.activity.logoUrl = this.getLogo();
        window.StylePair = this.stylePair;
        window.Animations = Animation;
        ResizeEvent.on((width, height) => {
            console.log(`${width}   ${height}`);
        });
    },
    mounted() {
        this.scrollImage(20);
        
    },
    methods: {
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
