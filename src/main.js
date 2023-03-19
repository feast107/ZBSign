import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import 'ideal-image-slider/ideal-image-slider.css'
import 'ideal-image-slider/themes/default/default.css'
import { ElMessage } from 'element-plus'
import './utils/Global'

let app = createApp(App)
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component)
}

app.config.unwrapInjectedRef = true
app.use(ElementPlus)
app.$message = ElMessage;
app.mount('#app')
