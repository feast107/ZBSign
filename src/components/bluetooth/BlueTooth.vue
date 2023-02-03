<template>
    <div>
        <li :key="item.id" v-for="(item,index) of blueToothList">
            {{ item.name }}
        </li>
    </div>
</template>

<script>
export default {
    name: 'BlueTooth',
    data() {
        return {
            blueToothList: []
        }
    },
}
</script>
<style scoped>
h3 {
    margin: 40px 0 0;
}

ul {
    list-style-type: none;
    padding: 0;
}

li {
    display: inline-block;
    margin: 0 10px;
}

a {
    color: #42b983;
}
</style>
