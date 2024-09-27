import './assets/main.css'
import 'simplebar-vue/dist/simplebar.min.css'
import { createApp } from 'vue'
import pinia from '@renderer/stores'
import router from './router'
import App from './App.vue'
import components from './components'
import { autoAnimatePlugin } from '@formkit/auto-animate/vue'
const app = createApp(App)

app.use(pinia)
app.use(router)
app.use(components)
app.use(autoAnimatePlugin)

app.mount('#app')
