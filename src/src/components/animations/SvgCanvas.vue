<template>
    <svg viewBox="0 0 10000 6900" class="strokes" xmlns="http://www.w3.org/2000/svg" version="1.1">
        <g fill="none">
            <path v-for="stroke in strokes" :key="stroke" :d="stroke.p" :stroke="stroke.c" stroke-width="10">
            </path>
        </g>
    </svg>
</template>

<script>
export default {
    props: {
        strokes: {
            type: Array,
            default: () => [],
        }
    }
}
</script>