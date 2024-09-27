<template>
  <div class="FooterMusicPlayer">
    <audio
      ref="audioElement"
      :src="musicPlayerList.CurrentPlayerMusicInfo.url[0]"
      :volume="PlayerControlConfig.volume / 100"
    ></audio>
    <a-slider
      v-model="PlayerControlConfig.currentTime"
      class="slider"
      :max="PlayerControlConfig.duration"
      :format-tooltip="formatter"
      @change="setAudioProgress($event)"
    />
    <div class="MusicInfo">
      <div v-if="musicPlayerList.CurrentPlayerMusicInfo?.Image" class="cover">
        <img
          :src="musicPlayerList.CurrentPlayerMusicInfo?.Image.replace(/\{size\}/g, '480')"
          alt=""
        />
      </div>
      <div class="info">
        <div class="AlbumName text-overflow">
          {{ musicPlayerList.CurrentPlayerMusicInfo?.SongName }}
        </div>
        <div class="SingerName text-overflow">
          {{ musicPlayerList.CurrentPlayerMusicInfo?.SingerName }}
        </div>
      </div>
    </div>
    <div class="PlayerHandle">
      <button class="playerBtn" @click="PlayOrPause">
        <component :is="!playStatus ? Play : Pause" :size="24"></component>
      </button>
    </div>
    <div class="Handle">
      <div class="VolumeControl">
        <component
          :is="
            PlayerControlConfig.volume === 0
              ? VolumeOff
              : PlayerControlConfig.volume <= 50
                ? Volume1
                : Volume2
          "
          :size="18"
        ></component>
        <a-slider
          v-model="PlayerControlConfig.volume"
          class="volumeSlider"
          :max="100"
          :style="{ width: '60px' }"
          :format-tooltip="(e) => `${Number(e.toFixed(2))}%`"
        ></a-slider>
      </div>
    </div>
  </div>
</template>

<script setup>
import { VolumeOff, Volume1, Volume2 } from 'lucide-vue-next'
import { useMusicPlayerListStore } from '@/stores'
import { nextTick, onMounted, ref, watch } from 'vue'
import { Play, Pause } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useStorage } from '@vueuse/core'
const playStatus = ref(false) // 播放状态
const PlayerControlConfig = useStorage('kugou.PlayerControlConfig', {
  duration: 0,
  currentTime: 0,
  volume: 100
})
const audioElement = ref(null) // 音频元素
const musicPlayerList = useMusicPlayerListStore()
const PlayOrPause = () => {
  const isPlaying = !audioElement.value.paused
  if (audioElement.value.src === `http://${window.location.hostname}:${window.location.port}/`) {
    return
  }
  if (isPlaying) {
    audioElement.value.pause()
    playStatus.value = false
  } else {
    audioElement.value.currentTime = PlayerControlConfig.value.currentTime
    audioElement.value.play()
    playStatus.value = true
  }
}
onMounted(() => {
  audioElement.value.addEventListener('timeupdate', () => {
    PlayerControlConfig.value.currentTime = audioElement.value.currentTime
    PlayerControlConfig.value.duration = audioElement.value.duration
  })
})
watch(
  () => musicPlayerList.CurrentPlayerMusicInfo,
  () => {
    playMusic()
  }
)
function setAudioProgress(timeInSeconds) {
  if (audioElement.value) {
    audioElement.value.currentTime = timeInSeconds
  }
}
function formatter(value) {
  return `${dayjs(value * 1000).format('mm:ss')}`
}
async function playMusic() {
  await nextTick()
  audioElement.value.play()
  playStatus.value = true
}
</script>
<style lang="scss" scoped>
.FooterMusicPlayer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  height: 60px;
  background-color: rgba(255, 255, 255, 0.8);
  backdrop-filter: blur(10px);
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 50px;
  // .slider {
  //   width: 200px;
  // }
  .slider {
    position: absolute;
    top: -6.5px;
    left: 0;
  }
  .MusicInfo {
    display: flex;
    align-items: center;
    // justify-content: space-evenly;
    width: 220px;
    overflow: hidden;
    .cover {
      width: 42px;
      height: 42px;
      margin-right: 15px;
      border-radius: 5px;
      overflow: hidden;
      img {
        width: 100%;
        height: 100%;
      }
    }
    .info {
      display: flex;
      flex-flow: column nowrap;
      .AlbumName {
        font-size: 1em;
        font-weight: bold;
        width: 150px;
        overflow: hidden;
      }
      .SingerName {
        font-size: 0.8em;
        color: #6c6c6c;
        width: 150px;
        overflow: hidden;
      }
    }
  }
  .PlayerHandle {
    .playerBtn {
      border: none;
      padding: 10px;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background-color: transparent;
      transition: all 0.2s;
      &:hover {
        background-color: #f2f2f4;
      }
      &:active {
        transform: scale(0.95);
      }
    }
  }

  .Handle {
    width: 220px;
    .VolumeControl {
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
    }
  }
}
</style>
