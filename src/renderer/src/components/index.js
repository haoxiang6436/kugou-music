import TitleNavBar from './modules/TitleNavBar.vue'
import simplebar from 'simplebar-vue'
import FooterMusicPlayer from './modules/FooterMusicPlayer.vue'
import LoginView from './modules/LoginView.vue'
import ViewContainer from './modules/ViewContainer.vue'
export default {
  install(app) {
    app.component('TitleNavBar', TitleNavBar)
    app.component('Simplebar', simplebar)
    app.component('FooterMusicPlayer', FooterMusicPlayer)
    app.component('LoginView', LoginView)
    app.component('ViewContainer', ViewContainer)
  }
}