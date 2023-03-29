<template>
    <el-container style="z-index: 1">
        <el-header style="margin-top: 20px">
            <el-page-header @back="quitErase">
                <template #content>
                    <span class="text-large font-600 mr-3"> {{ activity.title }} </span>
                </template>
                <template #default />
                <template #extra>
                    <div class="flex items-center">
                        <el-button @click="quitErase">取消</el-button>
                        <el-button type="primary" @click="save">保存</el-button>
                    </div>
                </template>
            </el-page-header>
        </el-header>
        <el-main>
            <el-empty v-if="pages.length == 0" description="空" />
            <el-scrollbar v-else id="MainSpace">
                <el-space wrap size="large">
                    <el-card :key="page" :style="`${width + 50}px`" v-for="page in pages">
                        <SvgContainer :thick="eraseThick" :is-erasing="isErasing" :width="`${width}px`"
                            :strokes="page.strokes" :on-remove-stroke="
                                (_) => {
                                    onRemove(_, page.pageNum);
                                }
                            " />
                    </el-card>
                </el-space>
                <div v-if="enableErase" z-index="50" class="Rubber"
                    :style="`left:${place.x}px;top:${place.y}px;height:${eraseSize}px;width:${eraseSize}px;`"></div>
            </el-scrollbar>
        </el-main>
    </el-container>
    <div class="footer">
        <div class="bottomBack">
            <el-popover trigger="hover">
                <el-space size="default">
                    <div v-for="erase in sizes" :key="erase" @click="() => this.setErase(erase)"
                        :style="`width:${erase}px;height:${erase}px;background-color:#0073ff;`"></div>
                    <el-divider direction="vertical" />
                    <div style="width: 20px; height: 20px" @click="fallbackOne">
                        <img src="../../assets/Main/Erase/Fallback.svg" />
                    </div>
                </el-space>
                <template #reference>
                    <el-button circle @click="enableErase = !enableErase" :type="enableErase ? '' : 'info'">
                        <img v-if="enableErase" src="../../assets/Main/Erase/Erase-enabled.svg" />
                        <img v-else src="../../assets/Main/Erase/Erase-disabled.svg" />
                    </el-button>
                </template>
            </el-popover>
        </div>
        <div class="footer-inner"></div>
    </div>
</template>

<script>
import { Activity } from "@/utils/Activity";
import { ComponentKey, Handlers } from "@/utils/Definition";
import SvgContainer from "./SvgContainer.vue";
export default {
    inject: [ComponentKey.ModifingActivity],
    components: {
        SvgContainer,
    },
    data() {
        return {
            Handlers: Handlers,
            /**
             * @type {Activity}
             */
            activity: this[ComponentKey.ModifingActivity],
            regions: [],
            pages: [],
            width: 370,
            scaling: false,
            isErasing: false,
            enableErase: false,
            removedStrokes: [],
            eraseSize: 4,
            eraseThick: 4 * 15,
            sizes: [4, 8, 12, 16],
            place: null,
        };
    },
    watch: {
        eraseSize(n, o) {
            this.eraseThick = n * 20;
        },
        enableErase(n, o) {
            if (n) {
            }
        },
    },
    async created() {
        let pages = await this.activity.queryWrittenPages();
        if (!pages.Success) return;
        pages.data.forEach(async (x) => {
            let promise = await this.activity.queryStrokes(x);
            let addr = this.activity.getPageAddress(x);
            this.pages.push({
                strokes: promise.data,
                pageNum: x,
            });
        });
    },
    mounted() {
        this.mountEvents();
    },
    beforeUnmount() {
        this.unmountEvents();
    },
    methods: {
        quitErase() {
            this.$emit(Handlers.QuitErase);
            console.log("??");
        },
        mountEvents() {
            window.onmousewheel = this.mousewheel;
            window.onkeyup = (e) => {
                this.scaling = e.key != "Control";
            };
            window.onkeydown = (e) => {
                this.scaling = e.key == "Control";
            };
            window.onmousedown = () => {
                if (this.enableErase) {
                    this.isErasing = true;
                }
            };
            window.onmouseup = () => {
                this.isErasing = false;
            };
            let dom = document.getElementById("MainSpace");
            if (dom)
                dom.onmousemove = (e) => {
                    this.onMouseMove(e, dom);
                };
        },
        unmountEvents() {
            window.onmousewheel = null;
            window.onkeyup = null;
            window.onkeydown = null;
            window.onmousedown = null;
            window.onmouseup = null;
            let dom = document.getElementById("MainSpace");
            if (dom) dom.onmousemove = null;
        },
        /**
         * @param {WheelEvent} event
         */
        mousewheel(event) {
            if (!this.scaling) return;
            if (event.deltaY > 0) {
                if (this.width > 10) {
                    this.width -= 10;
                }
            } else {
                this.width += 10;
            }
        },
        onRemove(stroke, pageNum) {
            stroke.pageNum = pageNum;
            this.removedStrokes.add(stroke);
            console.log(stroke);
        },
        fallbackOne() {
            if (this.removedStrokes.length > 0) {
                let s = this.removedStrokes.pop();
                s.fallback();
            }
        },
        setErase(thick) {
            this.eraseSize = thick;
            this.enableErase = true;
        },
        onMouseMove(e, dom) {
            this.place = {
                x: e.pageX - dom.offsetLeft - this.eraseSize / 2,
                y: e.pageY - dom.offsetTop - this.eraseSize / 2,
            };
        },
        save(){
            this;
            debugger;
        },
    },
};
</script>

<style scoped lang="scss">
.el-header {
    height: unset;

    .el-page-header {
        width: 100%;
        height: 100%;
    }
}

.Rubber {
    position: absolute;
    background: white;
    border: 1px solid #c2c2c2;
    pointer-events: none;
}

.el-container {
    height: 98%;
}

.footer {
    z-index: 0;
    position: absolute;
    padding: 0;
    margin: 0;
    width: 100%;
    bottom: 0;

    .footer-inner {
        height: 0;
        z-index: 0;
        width: 100%;
        padding-bottom: calc(1 / 14 * 100%);
    }

    .bottomBack {
        left: 0;
        top: 0;
        position: absolute;
        z-index: 20;
        height: 100%;
        width: 100%;
        background-image: url(../../assets/Main/Erase/Bottom.svg);
        background-repeat: no-repeat;
        background-position: center;
        background-size: contain;
        pointer-events: visible;

        img {
            width: 100%;
        }

        .el-button {
            margin-top: 1%;
            height: 60%;
            width: 4.2%;
            padding: 0;
        }
    }
}
</style>
