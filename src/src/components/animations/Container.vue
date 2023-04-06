<template>
    <Anoaspratio :ratio="0.72" :class="can.className" :style="`display:${can.display}`">
        <div class="rightBorder" :style="`background-image:url(${activity.rightBorder});z-index: 500;`">
        </div>
        <Ascaler :horizontal="82" :vertical="78.6">
            <div class="innerCanvas"
                :style="`width:100%;height:100%;display:${can.display};background-image:url(${activity.pageUrl});background-size: contain;`">
                <SvgCanvas :strokes="can.strokes"></SvgCanvas>
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
import SvgCanvas from "./SvgCanvas.vue";
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
    components: { Aspratio, MultipleBorder, Anoaspratio, Ascaler, SvgCanvas },
    created() {
        this.canvas;
        this.can;
    }
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
