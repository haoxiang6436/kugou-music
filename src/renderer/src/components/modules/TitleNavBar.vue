<template>
  <div class="TitleNavBar">
    <div class="PageControls">
      <ChevronLeft class="btn" :size="btnSize + 5" color="" @click="router.go(-1)" />
      <ChevronRight class="btn" :size="btnSize + 5" color="" @click="router.go(+1)" />
      <div class="search">
        <Search
          :size="btnSize"
          style="position: absolute; left: 8px; top: 50%; transform: translateY(-50%)"
        />
        <input v-model="SearchWord" @keyup.enter="JumpSearchView" />
      </div>
    </div>
    <div class="WindowAction">
      <div class="btn">
        <Minus :size="btnSize" color="" @click="() => WindowHandler('minimize')" />
      </div>
      <div class="btn">
        <Maximize :size="btnSize" color="" @click="() => WindowHandler('maximize')" />
      </div>
      <!-- <div class="btn"><Minimize :size="btnSize" color="" @click="WindowMinimize" /></div> -->
      <div class="btn close">
        <X :size="btnSize" color="" @click="() => WindowHandler('close')" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { X, Maximize, Minus, ChevronLeft, ChevronRight, Search } from 'lucide-vue-next'
import { useRouter, useRoute } from 'vue-router'
import { ref } from 'vue'
import { eventBus } from '@/utils/eventBus'
const btnSize = 18
const router = useRouter()
const route = useRoute()
const SearchWord = ref('风居住的街道')
const JumpSearchView = () => {
  if (!SearchWord.value) return
  if (route.name === 'SearchView') {
    eventBus.emit('searchKeywordChange', SearchWord.value)
    return
  }
  router.push({ name: 'SearchView', query: { keyword: SearchWord.value } })
}
const WindowHandler = (e) => window.api.WindowHandler(e)
</script>

<style lang="scss" scoped>
.TitleNavBar {
  $height: 76px;
  position: fixed;
  left: 0;
  top: 0;
  width: 100vw;
  // background-color: rgba(255, 162, 162, 0.3);
  // backdrop-filter: blur(5px);
  height: $height;
  line-height: $height;
  display: flex;
  -webkit-app-region: drag;
  z-index: 999;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 26px;
  .PageControls {
    display: flex;
    margin-left: 240px;
    align-items: center;
    & > * {
      margin-right: 16px;
    }
    .search {
      position: relative;
      width: fit-content;
    }
    input {
      -webkit-app-region: no-drag;
      border: none;
      background-color: #e3e3e3;
      border-radius: 10px;
      padding: 10px 15px;
      padding-left: 30px;
      height: 32px;
      transition: all 0.2s;
      font-size: 12px;
      width: 200px;
      &:focus {
        width: 220px;
      }
    }
  }
  .WindowAction {
    display: flex;
    margin-left: auto;
  }
  .btn {
    -webkit-app-region: no-drag;
    width: 52px;
    // height: 100%;
    background-color: transparent;
    border: none;
    cursor: pointer;
    display: flex;
    justify-content: center;
    align-items: center;
    outline: none;
    &:hover {
      color: #4b81fb;
      // background-color: #ededed;
    }
    &.close:hover {
      color: #fe6161;
      // background-color: #fe6161;
    }
  }
}
</style>
