<template>
    <el-container style="padding:20px">
        <el-header>
            <el-page-header @back="quitErase">
                <template #content>
                    <span class="text-large font-600 mr-3"> 擦除笔迹 </span>
                </template>
                <template #default />
            </el-page-header>
        </el-header>
        <el-main>
            <el-scrollbar>
                <el-space wrap size="large">
                    <el-card :key="page" :style="`${width + 50}px`" v-for="page in pages">
                        <SvgContainer :thick="eraseSize" :is-erasing="isErasing" :width="`${width}px`"
                            :strokes="page.strokes" :on-remove-stroke="(_) => { onRemove(_, page.pageNum); }" />
                    </el-card>
                </el-space>
            </el-scrollbar>
        </el-main>
    </el-container>
</template>

<script>
import { Activity } from '@/utils/Activity';
import { ComponentKey, Handlers } from '@/utils/Definition';
import SvgContainer from './SvgContainer.vue';
export default {
    inject: [ComponentKey.ModifingActivity],
    components: {
        SvgContainer
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
            enableErase: true,
            removedStrokes: [],
            eraseSize: 100,
        }
    },
    async created() {
        let pages = await this.activity.queryWrittenPages();
        if (!pages.Success) return;
        pages.data.forEach(async x => {
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
    unmounted() {
        this.unmountEvents();
    },

    methods: {
        quitErase() {
            this.$emit(Handlers.QuitErase);
            console.log("??")
        },
        mountEvents() {
            window.onmousewheel = this.mousewheel;
            window.onkeyup = (e) => { this.scaling = e.key != "Control"; };
            window.onkeydown = (e) => { this.scaling = e.key == "Control"; };
            window.onmousedown = () => { if (this.enableErase) { this.isErasing = true; } }
            window.onmouseup = () => { this.isErasing = false; }
        },
        unmountEvents() {
            window.onmousewheel = null;
            window.onkeyup = null;
            window.onkeydown = null;
            window.onmousedown = null;
            window.onmouseup = null;
        },
        /**
         * @param {WheelEvent} event
         */
        mousewheel(event) {
            if (!this.scaling) return;
            if (event.deltaY > 0) {
                this.width -= 10;
            } else {
                this.width += 10;
            }
        },
        onRemove(stroke, pageNum) {
            stroke.pageNum = pageNum;
            this.removedStrokes.add(stroke);
            console.log(stroke)
        },
        fallbackOne() {
            if (this.removedStrokes.length > 0) {
                let s = this.removedStrokes.pop();
                s.fallback();
            }
        },
        setErase(thick) {
            this.eraseSize = thick;
        }
    },
}
</script>

<style scoped>
.el-page-header {
    width: 100%;
    height: 100%;
}
</style>