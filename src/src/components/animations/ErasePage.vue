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
            <div id="MainSpace">
                <el-empty v-if="pages.length == 0" description="空" />
                <el-scrollbar v-else>
                    <el-space wrap size="large" style="padding-top:20px">
                        <el-badge :key="page" v-for="page in pages" :value="page.pageNum" class="item" type="primary">
                            <el-card :style="`${width + 50}px`">
                                <SvgContainer :thick="eraseThick" :is-erasing="isErasing" :width="`${width}px`"
                                    :strokes="page.strokes" :on-remove-stroke="
                                        (_) => {
                                            onRemove(_, page.pageNum);
                                        }
                                    " />
                            </el-card>
                        </el-badge>
                    </el-space>
                    <div v-if="enableErase" z-index="50" class="Rubber"
                        :style="`left:${place.x}px;top:${place.y}px;height:${eraseSize}px;width:${eraseSize}px;`"></div>
                </el-scrollbar>
            </div>
        </el-main>
    </el-container>
    <div class="footer">
        <Aspratio :ratio="1 / 14">
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
        </Aspratio>
    </div>
</template>

<script>
import { Activity } from "@/models/Activity";
import { ComponentKey, Handlers } from "@/utils/Definition";
import { Stroke } from "@/models/Stroke";
import Aspratio from "../layout/Aspratio.vue";
import SvgContainer from "./SvgContainer.vue";
export default {
    inject: [ComponentKey.ModifingActivity],
    components: {
        SvgContainer,
        Aspratio
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
            if (promise.Success) {
                /**
                 * @type {Stroke[]}
                 */
                let strokes = promise.data;
                let serials = {};
                strokes.forEach(s => {
                    if (!serials[s.s]) { serials[s.s] = []; }
                    serials[s.s].push(s);
                });
                Object.keys(serials).forEach(k => {
                    this.pages.push({
                        strokes: serials[k],
                        pageNum: x,
                        penSerial: k
                    });
                })
                this.pages = this.pages.orderBy(x => x.pageNum);
            }
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
        async save() {
            this;
            let updates = {};
            this.removedStrokes.forEach(x => {
                let list = updates[x.pageNum];
                if (!list) { list = updates[x.pageNum] = []; }
                /**
                 * @type {Stroke}
                 */
                let stroke = x.stroke;
                list.add(stroke.st);
            })

            let wait = Object.keys(updates);
            let allComplete = true;
            for (let i = 0; i < wait.length; i++) {
                let key = wait[i];
                let r = await this.activity.deleteStrokes(key, updates[key]);
                if (r.data != 1) {
                    allComplete = false;
                    this.$message.error("擦除失败")
                }
            }
            if (allComplete) {
                this.$message.success("擦除成功");
            }
            this.quitErase();
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

    #MainSpace {
        height: 100%;
        width: 100%;
    }
}

.footer {
    z-index: 0;
    position: absolute;
    padding: 0;
    margin: 0;
    width: 100%;
    bottom: 0;

    .bottomBack {
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
