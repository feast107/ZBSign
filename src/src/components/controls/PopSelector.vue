<template>
    <el-popover @show="show" placement="right" :width="400" trigger="click">
        <template #reference>
            <el-button style="padding: 0; border: none">
                <img style="width: 30px; height: 30px" :src="src" />
            </el-button>
        </template>
        <el-selector>
            
        </el-selector>
        <slot ref="selector"></slot>
    </el-popover>
</template>

<script>
export default {
    props: {

    },
}
</script>