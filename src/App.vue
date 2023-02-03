<template>
  <BlueTooth style="position:fixed;margin-top: 20px;margin-left: 20px;">
  </BlueTooth>
  <img alt="Vue logo" src="./assets/logo.png" />
  <DrawView v-if="isMain()"/>
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import BlueTooth from "./components/bluetooth/BlueTooth.vue";
import DrawView from "./components/Demo/DrawView.vue";
import { IpcMessage, WindowType } from "./utils/Definition";

let pathname = new URL(window.location).pathname.substring(1);
let searching = false
let blueToothList = []
export default {
  name: "App",
  components: {
    HelloWorld,
    BlueTooth,
    DrawView,
  },
  beforeCreate() { },
  data() {
    return {
      searching,
      list: blueToothList
    };
  },
  methods: {
    isMain: () => pathname === WindowType.Main,
    isBlueTooth: () => searching,
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
