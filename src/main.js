import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import VueCropper from 'vue-cropper'
import 'vue-cropper/dist/index.css'

let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}
app.config.unwrapInjectedRef = true
app.use(ElementPlus)
app.use(VueCropper)
app.mount('#app')
