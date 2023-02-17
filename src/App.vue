<template>
	<MainPage v-if="this.user != null && this.user.isLogin" />
<HomePage v-else />
</template>

<script>
import HomePage from "./components/HomePage.vue";
import MainPage from "./components/MainPage.vue";
import BlueTooth from "./components/BlueTooth.vue";
import { User } from './utils/User';
import { Bridges, ComponentKey, Dotpen } from "./utils/Definition";
import { computed } from 'vue'
export default {
	name: "App",
	components: {
		HomePage,
		MainPage,
		BlueTooth,
	},
	provide() {
		return {
			[ComponentKey.User]: computed(() => this.user),
			[ComponentKey.Dotpen]: computed(() => new Dotpen()),
		}
	},
	data() {
		return {
			user: new User(),
		}
	},
	created() {
		this.user.isLogin = true;
		window[Bridges.Navigator] = document[Bridges.Navigator] = {
			$BlueTooth: {
				requestDevice(config) {
					if (this.$Promise) return this.$Promise;
					const ret = (this.$Promise = navigator.bluetooth.requestDevice(config));
					return ret.catch(e => console.log(e)).finally(() => {
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

img {
	position: unset;
	pointer-events: none;
}

.el-form-item__label {
	user-select: none;
	pointer-events: none;
}
</style>
