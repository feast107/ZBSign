<template>
    <el-row class="multi-border" style="width:100%;height:100%;position: absolute;">
        <el-row :style="`height:${Top}%;width:100%`">
            <div :style="style(Left, 1)" class="borders">
                <slot name="left-up"></slot>
            </div>
            <div :style="style(Center, 2)" class="borders">
                <slot name="up"></slot>
            </div>
            <div :style="style(Right, 3)" class="borders">
                <slot name="right-up"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Middle}%;width:100%`">
            <div :style="style(Left, 8)" class="borders">
                <slot name="left"></slot>
            </div>
            <div :style="`width:${Center}%;height:100%;`" class="borders">
                <slot name="center"></slot>
            </div>
            <div :style="style(Right, 4)" class="borders">
                <slot name="right"></slot>
            </div>
        </el-row>
        <el-row :style="`height:${Bottom}%;width:100%`">
            <div :style="style(Left, 7)" class="borders">
                <slot name="left-bottom"></slot>
            </div>
            <div :style="style(Center, 6)" class="borders">
                <slot name="bottom"></slot>
            </div>
            <div :style="style(Right, 5)" class="borders">
                <slot name="right-bottom"></slot>
            </div>
        </el-row>
    </el-row>
</template>

<script>
export default {
    props: ['left', 'right', 'top', 'bottom', 'baseUrl', 'index'],
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
    },
    methods: {
        style(width, num) {
            return `z-index:${this['index']};width:${width}%;height:100%;background-image:url(${this.baseUrl}/${num}.png)`
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