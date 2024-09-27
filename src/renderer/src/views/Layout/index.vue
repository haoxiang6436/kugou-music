<template>
  <div class="LayoutView">
    <div class="left">
      <LeftRouterNav />
    </div>
    <div class="right">
      <router-view v-slot="{ Component }">
        <!-- <keep-alive> -->
        <component :is="Component" />
        <!-- </keep-alive> -->
      </router-view>
    </div>
  </div>
</template>

<script setup>
import LeftRouterNav from './components/LeftRouterNav.vue'
</script>

<style lang="scss" scoped>
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
</style>
