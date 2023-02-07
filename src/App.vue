<template>
	<BlueTooth style="position:fixed;margin-top: 20px;margin-left: 20px;" />
	<img alt="Vue logo" src="./assets/logo.png" />
	<DisplayView />
</template>

<script>
import HelloWorld from "./components/HelloWorld.vue";
import BlueTooth from "./components/BlueTooth.vue";
import DrawView from "./components/DrawView.vue";
import DisplayView from "./components/DisplayView.vue";
import { ComponentKey, Dotpen } from "./utils/Definition";
import { computed } from 'vue'
export default {
	name: "App",
	components: {
		HelloWorld,
		BlueTooth,
		DrawView,
		DisplayView
	},
	provide: {
		[ComponentKey.Dotpen]: computed(() => new Dotpen()),
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
