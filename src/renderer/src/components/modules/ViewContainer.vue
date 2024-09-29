<template>
  <Simplebar class="ViewContainer view">
    <slot />
  </Simplebar>
</template>

<script setup></script>

<style lang="scss">
/* 当鼠标悬停在滚动条上时改变滚动条的颜色 */
.simplebar-scrollbar:before {
  background-color: #929292; /* 鼠标悬停时滚动条颜色 */
  // background-color: #ff0000; /* 鼠标悬停时滚动条颜色 */
}
</style>
