<template>
    <div ref="asp"
        :style="`width:${width}${absolute ? 'px' : '%'};height:${height}${absolute ? 'px' : '%'};margin-top:${marginV}px;margin-bottom:${marginV}px;margin-left:${marginH}px;margin-right:${marginH}px`">
        <slot></slot>
    </div>
</template>
<script>
export default {
    props: {
        ratio: {
            type: Number,
            default: 1,
        },
        absolute: {
            type: Boolean,
            default: false,
        }
    },
    mounted() {
        this.$nextTick(this.resize);
        this.$refs.asp.parentElement.addEventListener("resize", this.resize);
    },
    unmounted() {
        if (this.$refs.asp) {
            this.$refs.asp.parentElement.removeEventListener("resize", this.resize);
        }
    },
    data() {
        return {
            marginV: 0,
            marginH: 0,
            width: 0,
            height: 0,
            deep: 0,
        }
    },
    methods: {
        resize() {
            let parent = this.$refs.asp.parentElement;
            //let pRect = parent.getBoundingClientRect();
            var pRect = {};
            pRect.height = parent.offsetHeight;
            pRect.width = parent.offsetWidth;
            debugger;
            if (pRect.height == 0 && pRect.width == 0) {
                if (this.deep > 3) {
                    setTimeout(this.resize, 20);
                    return;
                }
                this.deep++;
                let vue = this;
                this.$nextTick(() => { vue.resize(); });
                return;
            }
            this.deep = 0;
            let desiredWidth = pRect.width;
            let desiredHeight = pRect.width * this.ratio;
            if (desiredHeight > pRect.height) {
                this.height = desiredHeight = pRect.height;
                desiredWidth = desiredHeight / this.ratio;
                this.marginH = (pRect.width - desiredWidth) / 2;
                this.width = desiredWidth;
                if (!this.absolute) {
                    this.height = 100;
                    this.width = desiredWidth * 100 / pRect.width;
                }
                debugger;
            } else {
                this.width = desiredWidth;
                this.height = desiredHeight;
                this.marginV = (pRect.height - desiredHeight) / 2;
                if (!this.absolute) {
                    this.width = 100;
                    this.height = desiredHeight * 100 / pRect.height;
                }
            }
        },
    }
};
</script>
