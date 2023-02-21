<template>
    <div id="PlayMain">
        <div id="Foreground">
            <el-container id="Container">
                <el-header style="height:20%;">
                    <div style="background-color:#0934df"></div>
                </el-header>
                <el-container style="height:75%;">
                    <el-aside style="width:40%;padding: 20px;">
                        <div id="Pictures">
                            <ul>
                                <li v-for="url in this.urls" :key="url" >
                                    <img :src="url" />
                                </li>
                            </ul>
                        </div>
                    </el-aside>
                    <el-main style="width:60%">
                        <div style="background-color:white;width: 100%;height: 100%;">

                        </div>
                    </el-main>
                    
                </el-container>
                <el-footer style="height: 5%;">
                    
                </el-footer>
            </el-container>
        </div>
        <div id="Background"></div>
    </div>
</template>

<script>
import "animate.css"
import { Animation } from "@/utils/Animation";
export default {
    beforeCreate() {
        document.addEventListener('keyup', function (e) {
            e.key
        });
    },
    data() {
        let getUrl = (num) => `http://47.93.86.37:8686/taskFile/sign/${num}.JPG`;
        return {
            stylePair: Animation.getOpposite("fade", "Up"),
            index: 0,
            interval: null,
            pictures: [],
            urls: [
                getUrl(1),
                getUrl(2),
                getUrl(3),
            ]
        }
    },
    created() {
        window.StylePair = this.stylePair;
        window.Animations = Animation;
    },
    mounted() {
        this.scrollImage(20);
    },
    methods: {
        animate(feature) { this.stylePair = Animation.getOpposite(feature, "Up") },
        playImage(timeout) {
            if (this.interval) {
                clearInterval(this.interval)
            }
            let pictures = document.querySelectorAll('.item');
            let nextImage = () => {
                pictures[this.index].className = this.stylePair[1]; //当前图片淡出
                this.index++;
                this.index = this.index % pictures.length;
                pictures[this.index].className = this.stylePair[0]; //下一张图片淡出
            }
            this.interval = setInterval(nextImage, timeout * 1000);
        },
        scrollImage(timeout) {
            if (this.interval) {
                clearInterval(this.interval);
            }
            var iSpeed = -1;
            let cont = document.getElementById('Pictures');
            let ul = cont.getElementsByTagName('ul')[0];
            ul.innerHTML += ul.innerHTML;
            let scroll = () => {
                ul.style.top = `${ul.offsetTop + iSpeed}px`;
                if (ul.offsetTop < -ul.offsetHeight / 2) {
                    ul.style.top = '0px';
                } else if (ul.offsetTop > 0) {
                    ul.style.top = `${(-ul.offsetHeight) / 2}px`;
                }

            }
            this.interval = setInterval(scroll, timeout);
        }
    }
}
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

        #Container {
            margin: 50px;
            height: calc(100% - 100px);
            width: calc(100% - 100px);

            #Pictures {
                padding: 0;
                height: 100%;
                width: 100%;
                position: relative;
                overflow: hidden;

                li {
                    background-size: cover;
                    background-repeat: no-repeat;
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