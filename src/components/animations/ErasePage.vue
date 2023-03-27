<template>
    <div>
        <div>
            
        </div>
    </div>
</template>

<script>
import { ComponentKey } from '@/utils/Definition';
export default {
    inject: [ComponentKey.ModifingActivity],
    data() {
        return {
            activity: this[ComponentKey.ModifingActivity],
            regions: [],
            svgs:[]
        }
    },
    created() { },
    unmounted() { }
}
</script>

<style>

</style>