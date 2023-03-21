<template>
    <div
        :style="`display:${can.display};background-image:url(${activity.rightBorder}); `"
        :class="can.className">
        <canvas
            :id="can.id"
            :z-index="can.index"
            class="innerCanvas"
            :style="`z-index:30;background-color:#aaaa0040`"
            :width="can.drawWidth"
            :height="can.drawHeight">
        </canvas>
        <div
            :style="`background-image:url(${activity.pageUrl});z-index:20`"
            class="innerCanvas"></div>
    </div>
</template>

<script>
import { ComponentKey } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
import { Canvas } from "@/utils/Canvas";
export default {
    props: ["canvas"],
    inject: [ComponentKey.PlayActicity, ComponentKey.Dotpen],
    data() {
        return {
            /**
             * @type {Activity}
             */
            activity: this[ComponentKey.PlayActicity],
            /**
             * @type {Canvas}
             */
            can: this["canvas"],
        };
    },
};
</script>

<style lang="scss">
.innerCanvas {
    left: 0;
    position: absolute;
    width: calc(100% - 100px);
    height: calc(100% - 100px);
    margin: 50px;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
