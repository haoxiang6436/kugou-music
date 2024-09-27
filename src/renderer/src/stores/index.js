import { createPinia } from 'pinia'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
const pinia = createPinia()
pinia.use(piniaPluginPersistedstate)
export default pinia
export * from './modules/MusicPlayerList' // 将所有的按需导出引入
export * from './modules/UserInfo' // 将所有的按需导出引入
