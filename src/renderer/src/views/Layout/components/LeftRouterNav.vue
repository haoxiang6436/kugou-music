<template>
  <div class="LeftRouterNav">
    <h1 class="TitleLogo">KuGouMusic</h1>
    <div class="OnlineMusicModules">
      <div class="MiniTitle">在线音乐</div>
      <div class="NavigationMenu">
        <router-link active-class="active" to="/layout" class="NavigationMenuItem"
          ><Compass :color="iconColor" /><span>主页</span></router-link
        >
      </div>
    </div>
    <div class="SelfMusicModules">
      <div class="MiniTitle">我的音乐</div>
      <div class="NavigationMenu">
        <div class="NavigationMenuItem" @click="onLogin">
          <Clock :color="iconColor" /><span>登录</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Compass, Clock } from 'lucide-vue-next'
import { eventBus } from '@/utils/eventBus'
const onLogin = () => {
  eventBus.emit('login')
}
const iconColor = '#626262'
</script>

<style lang="scss" scoped>
.LeftRouterNav {
  .TitleLogo {
    font-weight: bolder;
    // line-height: 0.8em;
    font-size: 24px;
  }
  .OnlineMusicModules,
  .SelfMusicModules {
    margin-top: 30px;
  }
  .NavigationMenu {
    .NavigationMenuItem {
      line-height: 40px;
      padding-left: 10px;
      margin-top: 10px;
      border-radius: 5px;
      cursor: pointer;
      transition: all 0.2s;
      display: flex;
      gap: 10px;
      align-items: center;
      text-decoration: none;
      &:hover {
        background-color: #ebebeb;
      }
      &.active {
        background-color: #e3e3e3;
      }
    }
  }
  .MiniTitle {
    font-size: 12px;
    color: #626262;
  }
}
</style>
