<template>
    <div style="width: 100%; height: 100%;">
        <div :style="wrapper">
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
        }
    },
    data() {
        return {
            wrapper: `overflow: hidden;position:relative;height: 0; width: 100%; padding: 0;padding-${this.direction}: calc(${this.ratio} * 100%);`,
        }
    }
};
</script>

<style></style>
