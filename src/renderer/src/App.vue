<script setup></script>
<template>
  <LoginView />
  <TitleNavBar />
  <div class="App">
    <router-view v-slot="{ Component }">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </router-view>
  </div>
  <FooterMusicPlayer />
</template>

<style lang="scss"></style>
