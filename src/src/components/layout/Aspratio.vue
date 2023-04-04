<template>
    <div ref="outer"
        :style="`width:${width}%; height: 100%;margin-top:${marginVertical}px;margin-left:${marginHorizen}px;margin-right:${marginHorizen}px;`">
        <div
            :style="`overflow: hidden;position:relative;height: 0; width: 100%; padding: 0;padding-${this.direction}: calc(${this.ratio} * 100%);`">
            <div style="position: absolute;top: 0; right: 0; bottom: 0; left: 0 ">
                <slot></slot>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        ratio: {
            type: Number,
            default: 1,
        },
        direction: {
            type: String,
            default: "top",
        },
    },

    mounted() {
        this.resize();
        window.addEventListener("resize", this.resize);
    },
    unmounted() {
        window.removeEventListener("resize", this.resize);
    },
    data() {
        return {
            marginVertical: 0,
            marginHorizen: 0,
            width: 100,
        }
    },
    methods: {
        resize() {
            let parent = this.$refs.outer.parentElement;
            let pRect = parent.getBoundingClientRect();
            let pw = pRect.width;
            let ph = pRect.height;
            let desiredWidth = 0;
            let desiredHeight = pw * this.ratio;
            if (desiredHeight > ph) {
                desiredHeight = ph;
                desiredWidth = desiredHeight / this.ratio;
                this.marginHorizen = (pw - desiredWidth) / 2;
                this.width = 100 * desiredWidth / pw;
            } else {
                this.marginVertical = (ph - desiredHeight) / 2;
            }
        }
    }
};
</script>

<style></style>
