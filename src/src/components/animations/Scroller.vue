<template>
    <div class="scroller" :style="style">
        <ul class="scroller-ul" ref="ul" :style="'transform: translateY(-' + offset + 'px);'">
            <li v-for="(warp, index) in list" ref="wrap" :key="warp" class="scroller-li">
                <img :src="warp.url" />
            </li>
            <li v-for="(warp, index) in list" ref="wrap" :key="warp" class="scroller-li">
                <img :src="warp.url" />
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    props: ['pictures', 'play', 'speed', 'style'],
    data() {
        let index = 1;
        return {
            interval: null,
            current: 0,
            offset: 0,
            list: this.pictures.select(x => { return { url: x, index: index++ } }),
        }
    },
    mounted() {
        if (this.play) this.scroll();
    },
    unmounted() {
        this.stop();
    },
    watch: {
        play(n, o) {
            if (n == o) return;
            if (n) this.scroll();
            else this.stop();
        },
        speed(n, o) { if (n == o) return; this.scroll(); }
    },
    methods: {
        scroll() {
            this.stop();
            this.interval = setInterval(() => {
                let height = this.$refs.ul.scrollHeight / 2;
                if (this.offset > height) {
                    this.offset -= height;
                }
                this.offset++;
                window.ul = this.$refs.ul;
            }, this.speed ? (500 / this.speed) : 20)
        },
        stop() {
            if (!this.interval) return;
            clearInterval(this.interval);
            this.interval = null;
        }
    },
}
</script>

<style scoped lang="scss">
.scroller {
    overflow: hidden;
    height: 100%;
    width: 100%;

    .scroller-ul {
        left: 0;
        padding: 0;
        margin: 0;

        .scroller-li {
            list-style: none;
            float: left;

            img {
                width: 100%;
            }
        }
    }
}
</style>