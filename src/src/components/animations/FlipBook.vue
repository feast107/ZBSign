<template>
    <flipbook class="flipbook" :pages="pages" v-slot="flipbook">
        <button @click="flipbook.flipLeft">Previous Page</button>
        <button @click="flipbook.flipRight">Next Page</button>
    </flipbook>
</template>
<script>
import Flipbook from 'flipbook-vue'
export default {
    name: 'FlipBook',
    data() {
        return {
            pages: [
                null,
                'http://placekitten.com/g/200/300',
                'http://placekitten.com/200/300',
                'http://placekitten.com/g/200/300',
                'http://placekitten.com/200/300'
            ],
        }
    },
    components: {
        Flipbook
    }
}
</script>

<style>
.flipbook {
    width: 90vw;
    height: 90vh;
}
</style>