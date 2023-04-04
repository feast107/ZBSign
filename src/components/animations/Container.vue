<template>
    <Aspratio :ratio="0.66" :class="can.className">
        <MultipleBorder :top="20" :bottom="20" :left="14" :right="14" :base-url="activity.rightBorder">
            <template #center>
                <div :style="`width:100%;height:100%;display:${can.display};background-image:url(${activity.pageUrl});`">
                    <canvas :id="can.id" :z-index="can.index" class="innerCanvas"
                        :style="`z-index:30;background-color:#aaaa0040`" :width="can.drawWidth" :height="can.drawHeight">
                    </canvas>
                </div>
            </template>
        </MultipleBorder>
    </Aspratio>
</template>

<script>
import { ComponentKey } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
import { Canvas } from "@/utils/Canvas";
import Aspratio from "../layout/Aspratio.vue";
import MultipleBorder from "./MultipleBorder.vue";
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
    methods: {},
    components: { Aspratio, MultipleBorder }
};
</script>

<style lang="scss">
.innerCanvas {
    width: 100%;
    height:  100%;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
