<template>
    <div
        :style="`position:relative;width:${horizontal}%;height:${vertical}%;top:50%;left:50%;transform:translate(-50%,-50%)`">
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
}
</script>