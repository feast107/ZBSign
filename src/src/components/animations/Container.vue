<template>
    <Anoaspratio :ratio="0.72" :class="can.className">
        <div class="rightBorder" :style="`background-image:url(${activity.rightBorder});z-index: 500;`">
        </div>
        <Ascaler :horizontal="82" :vertical="78.6">
            <div class="innerCanvas"
                :style="`width:100%;height:100%;display:${can.display};background-image:url(${activity.pageUrl});background-size: contain;`">
                <canvas :id="can.id" :z-index="can.index" class="innerCanvas"
                    :style="`z-index:30;background-color:#aaaa0040`" :width="can.drawWidth" :height="can.drawHeight">
                </canvas>
            </div>
        </Ascaler>
    </Anoaspratio>
</template>

<script>
import { ComponentKey } from "@/utils/Definition";
import { Activity } from "@/utils/Activity";
import { Canvas } from "@/utils/Canvas";
import Aspratio from "../layout/Aspratio.vue";
import MultipleBorder from "./MultipleBorder.vue";
import Anoaspratio from "../layout/Anoaspratio.vue";
import Ascaler from "../layout/Ascaler.vue";
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
    components: { Aspratio, MultipleBorder, Anoaspratio, Ascaler }
};
</script>

<style lang="scss">
.asp {
    position: absolute;
}

.rightBorder {
    position: absolute;
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}

.innerCanvas {
    width: 100%;
    height: 100%;
    background-size: contain;
    background-repeat: no-repeat;
    background-position: center;
}
</style>
