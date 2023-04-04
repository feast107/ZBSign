<template>
    <el-row class="multi-border" style="width:100%;height:100%;position: absolute;">
        <el-row :style="`height:${Top}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;background-image:url(${baseUrl}/1.png)`" class="borders">
                <slot name="left-up"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;background-image:url(${baseUrl}/2.png)`" class="borders">
                <slot name="up"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;background-image:url(${baseUrl}/3.png)`" class="borders">
                <slot name="right-up"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Middle}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;background-image:url(${baseUrl}/8.png)`" class="borders">
                <slot name="left"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;`" class="borders">
                <slot name="center"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;background-image:url(${baseUrl}/4.png)`" class="borders">
                <slot name="right"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Bottom}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;background-image:url(${baseUrl}/7.png)`" class="borders">
                <slot name="left-bottom"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;background-image:url(${baseUrl}/6.png)`" class="borders">
                <slot name="bottom"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;background-image:url(${baseUrl}/5.png)`" class="borders">
                <slot name="right-bottom"></slot>
            </div>
        </el-row>
    </el-row>
</template>

<script>
export default {
    props: ['left', 'right', 'top', 'bottom', 'baseUrl'],
    beforeCreate() {
    },
    created() {
    },
    data() {
        return {
            Left: this.left,
            Center: (100 - this.left - this.right),
            Right: this.right,
            Top: this.top,
            Middle: (100 - this.top - this.bottom),
            Bottom: this.bottom,
        }
    }
}
</script>

<style scoped lang="scss">
.multi-border {
    margin: 0;
    padding: 0;

    .borders {
        margin: 0;
        padding: 0;
        background-size: cover;
        background-repeat: no-repeat;
        background-position: center;
    }

}
</style>