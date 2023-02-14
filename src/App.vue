<template>
	<BlueTooth style="position:fixed;margin-top: 20px;margin-left: 20px;" />
	<HomePage />
</template>

<script>
import HomePage from "./components/HomePage.vue";
import BlueTooth from "./components/BlueTooth.vue";
import DrawView from "./components/DrawView.vue";
import DisplayView from "./components/DisplayView.vue";
import FlipBook from "./components/animations/FlipBook.vue";
import FadeInAndOut from "./components/animations/FadeInAndOut.vue";
import AnimationVue from './components/animations/AnimationVue.vue';
import { ComponentKey, Dotpen } from "./utils/Definition";
import { computed } from 'vue'
export default {
	name: "App",
	components: {
		HomePage,
		BlueTooth,
		DrawView,
		DisplayView,
		FlipBook,
		FadeInAndOut,
		AnimationVue,
	},
	provide: {
		[ComponentKey.Dotpen]: computed(() => new Dotpen()),
	},
	created() {
		window.$Navigator = document.$Navigator = {
			$BlueTooth: {
				requestDevice(config) {
					if (this.$Promise) return this.$Promise;
					const ret = (this.$Promise = navigator.bluetooth.requestDevice(config));
					return ret.catch((e) => console.log(e)).finally(() => {
						delete this.$Promise;
					});
				},
			},
		};
	}
};
</script>

<style>
#app {
	font-family: Avenir, Helvetica, Arial, sans-serif;
	-webkit-font-smoothing: antialiased;
	-moz-osx-font-smoothing: grayscale;
	text-align: center;
	color: #2c3e50;
	height: 100%;
	width:100%;
}
html{
	height: 100%;
	width:100%;
}
body{
	height: 100%;
	width:100%;
	margin: 0;
}
</style>
