<template>
  <div class="ForYou">
    <div class="title"></div>
    <div class="container">
      <div class="RecommendedDaily">
        <div class="title">每日推荐</div>
        <div class="icon"><Play fill="#fff" stroke="#fff" :size="16" /></div>
      </div>
      <div class="PrivateFM">
        <div class="pic"></div>
        <div class="MusicControlInfo">
          <div class="MusicName"></div>
          <div class="MusicAuthor"></div>
          Control
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { Play } from 'lucide-vue-next'
</script>

<style lang="scss" scoped>
.ForYou {
  .container {
    display: flex;
    justify-content: space-between;
    gap: 20px;
    .RecommendedDaily,
    .PrivateFM {
      background-image: linear-gradient(135deg, #acb6e5, #86fde8);
      background-image: linear-gradient(135deg, #a4aed9, #79e2cf);
      border-radius: 10px;
      height: 140px;
      flex: 1;
      padding: 20px 35px;
      display: flex;
      overflow: hidden;
    }
    .RecommendedDaily {
      .title {
        color: #fff;
        font-weight: bolder;
        font-size: 45px;
        line-height: 1.1em;
        letter-spacing: 5px;
        width: 120px;
        z-index: 1;
      }
      .icon {
        margin-left: auto;
        margin-top: auto;
        margin-right: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        height: 36px;
        width: 36px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        backdrop-filter: blur(10px);
      }
    }
    .PrivateFM {
      padding: 10px;
      align-items: center;
      .pic {
        height: 120px;
        width: 120px;
        border-radius: 10px;
        background-color: #79e2cf;
      }
    }
  }
}
</style>
