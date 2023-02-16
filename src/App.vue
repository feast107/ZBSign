<template>
	<BlueTooth style="position:fixed;margin-top: 20px;margin-left: 20px;" />
	<HomePage v-if="!this.user.isLogin"/>
	<MainPage v-if="this.user.isLogin"/>
</template>

<script>
import HomePage from "./components/HomePage.vue";
import DrawView from "./components/DrawView.vue";
import MainPage from "./components/MainPage.vue";
import BlueTooth from "./components/BlueTooth.vue";
import DisplayView from "./components/DisplayView.vue";
import FlipBook from "./components/animations/FlipBook.vue";
import FadeInAndOut from "./components/animations/FadeInAndOut.vue";
import AnimationVue from './components/animations/AnimationVue.vue';
import { User } from './utils/User';
import { ComponentKey, Dotpen } from "./utils/Definition";
import { computed } from 'vue'
import Request from "./utils/Request";
export default {
	name: "App",
	components: {
		HomePage,
		MainPage,
		BlueTooth,
		DrawView,
		DisplayView,
		FlipBook,
		FadeInAndOut,
		AnimationVue,
	},
	provide() {
		return {
			[ComponentKey.Http]: computed(()=> Request ),
			[ComponentKey.User]: computed(() => { return this.user; }),
			[ComponentKey.Dotpen]: computed(() => new Dotpen()),
		}
	},
	data() {
		return {
			user: new User(),
		}
	},
	created() {
		window.USER = this.user;
		this.user.isLogin = true;
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
	width: 100%;
}

html {
	height: 100%;
	width: 100%;
}

body {
	height: 100%;
	width: 100%;
	margin: 0;
}
</style>
