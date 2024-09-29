<template>
  <div class="LayoutView">
    <div class="left">
      <LeftRouterNav />
    </div>
    <div class="right">
      <ViewContainer>
        <router-view v-slot="{ Component }">
          <!-- <keep-alive> -->
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
          <!-- </keep-alive> -->
        </router-view>
      </ViewContainer>
    </div>
  </div>
</template>

<script setup>
import LeftRouterNav from './components/LeftRouterNav.vue'
</script>

<style lang="scss">
.LayoutView {
  width: 100vw;
  height: 100vh;
  display: flex;
  .left {
    width: 240px;
    background-color: #f6f6f6;
    padding: 20px;
  }
  .right {
    width: calc(100vw - 240px);
    background-color: #f9f9f9;
  }
}
/* 下面我们会解释这些 class 是做什么的 */
.fade-enter-active,
.fade-leave-active {
  transition: all 0.3s ease;
}

.fade-enter-from {
  transform: scale(1.1);
  opacity: 0;
}
.fade-leave-to {
  transform: scale(0.98);
  opacity: 0;
}
</style>
