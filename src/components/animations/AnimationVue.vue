<template>
    <h1 class="animate__animated animate__bounce">An animated element</h1>
    <img src="../../../test/2.jpg" alt="" class="item active">
    <img src="../../../test/1.jpg" alt="" class="item">
</template>

<script>
import "animate.css"
import { Animation } from "@/utils/Animation";
export default {
    data() {
        return {
            Prefix: "animate__animated",
            Animations: Animation,
            StylePair: [
                "animate__backInDown",
                "animate__backOutDown"
            ],
        }
    },
    created() {
        window.StylePair = this.StylePair;
        window.Animations = this.Animations;
    },
    mounted() {
        var item = document.querySelectorAll('.item');
        var index = 0; //记录图片的下标
        // 切换图片效果实现
        let nextImg = () => {
            item[index].className = window.StylePair[0]; //当前图片淡出
            index++;
            index = index % item.length;
            item[index].className = window.StylePair[1]; //下一张图片淡出
        }
        setInterval(nextImg, 2000)
    },
    methods: {
        animate: (className) => 'animate__animated ' + className,

    }
}
</script>

<style>
img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 1;
}
</style>