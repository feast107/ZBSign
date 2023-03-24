<template>
    <div>
        <ul>
            <li>

            </li>
        </ul>
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
        }
    },
    created() { },
    unmounted() { }
}
</script>
<style></style>