<template>
    <img src="../../../test/2.jpg" alt="" class="item active">
    <img src="../../../test/1.jpg" alt="" class="item">
    <link rel="stylesheet" href="@ideal-image-slider/ideal-image-slider.css">
	<link rel="stylesheet" href="@ideal-image-slider/themes/default/default.css">
</template>


<script type="text/javascript">
export default{
    mounted(){
        var item = document.querySelectorAll('.item');
        var index = 0; //记录图片的下标
        // 切换图片效果实现
        let timer1 = setInterval(nextImg, 2000)
        function nextImg() {
            console.log(item);
            item[index].className = "fadeout"; //当前图片淡出
            index++;
            index = index % 2;
            item[index].className = "fadein"; //下一张图片淡出
        }
    }
}
</script>


<style scoped>
img {
    position: absolute;
    top: 0;
    left: 0;
    opacity: 0;
}

.active {
    opacity: 1;
}

.fadeout {
    -webkit-transition: all 0.67s;
    -moz-transition: all 0.67s;
    -ms-transition: all 0.67s;
    -o-transition: all 0.67s;
    transition: all 0.67s;
    opacity: 0;
}

.fadein {
    -webkit-transition: all 0.67s;
    -moz-transition: all 0.67s;
    -ms-transition: all 0.67s;
    -o-transition: all 0.67s;
    transition: all 0.67s;
    opacity: 1;
}
</style>