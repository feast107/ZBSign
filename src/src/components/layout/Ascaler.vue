<template>
    <div ref="asc"
        :style="`width:${horizontal}%;height:${vertical}%;margin-top:${marginV}px;margin-bottom:${marginV}px;margin-left:${marginH}px;margin-right:${marginH}px`">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        horizontal: {
            type: Number,
            default: 100,
        },
        vertical: {
            type: Number,
            default: 100,
        }
    },
    mounted() {
        this.resize();
        this.$refs.asc.parentElement.addEventListener("resize", this.resize);
    },
    unmounted() {
        if (this.$refs.asc) {
            this.$refs.asc.parentElement.removeEventListener("resize", this.resize);
        }
    },
    methods: {
        resize() {
            let vue = this;
            let parent = vue.$refs.asc.parentElement;
            let pRect = parent.getBoundingClientRect();
            if (pRect.height == 0 && pRect.width == 0) {
                if (vue.deep > 3) {
                    setTimeout(this.resize, 20);
                    return;
                }
                vue.deep++;
                this.$nextTick(() => { vue.resize(); });
                return;
            }
            vue.deep = 0;
            vue.marginV = (100 - vue.vertical) / 2 * pRect.height / 100;
            vue.marginH = (100 - vue.horizontal) / 2 * pRect.width / 100;
        },
    },
    data() {
        return {
            marginV: 0,
            marginH: 0,
            deep: 0,
        }
    },
}
</script>