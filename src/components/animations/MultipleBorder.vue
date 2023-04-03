<template>
    <el-row class="multi-border" style="width:100%;height:100%;position: absolute;">
        <el-row :style="`height:${Top}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;`">
                <slot name="left-up"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;`">
                <slot name="up"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;`">
                <slot name="right-up"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Middle}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;`">
                <slot name="left"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;`">
                <slot name="center"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;`">
                <slot name="right"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Bottom}%;width:100%`">
            <div :style="`width:${Left}%;height:100%;`">
                <slot name="left-bottom"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;`">
                <slot name="bottom"></slot>
            </div>
            <div :style="`width:${Right}%;height:100%;`">
                <slot name="right-bottom"></slot>
            </div>
        </el-row>
    </el-row>
</template>

<script>
export default {
    props: ['left', 'middle', 'right', 'top', 'center', 'bottom'],
    beforeCreate() {
    },
    created() {
    },
    data() {
        return {
            Left: this.left,
            Center: this.center,
            Right: this.right,
            Top: this.top,
            Middle: this.middle,
            Bottom: this.bottom,
        }
    }
}
</script>

<style scoped lang="scss">
.multi-border {
    margin: 0;
    padding: 0;

    * {
        margin: 0;
        padding: 0;
    }
}
</style>