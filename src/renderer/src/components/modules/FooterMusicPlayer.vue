<template>
  <div class="FooterMusicPlayer">
    <audio
      ref="audioElement"
      :src="musicPlayerList?.ActivePlayerMusicInfo?.url[0]"
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
      <div v-if="musicPlayerList.ActivePlayerMusicInfo?.Image" class="cover">
        <img
          :src="musicPlayerList.ActivePlayerMusicInfo?.Image.replace(/\{size\}/g, '480')"
          alt=""
        />
      </div>
      <div class="info">
        <div class="AlbumName text-overflow">
          {{ musicPlayerList.ActivePlayerMusicInfo?.SongName }}
        </div>
        <div class="SingerName text-overflow">
          {{ musicPlayerList.ActivePlayerMusicInfo?.SingerName }}
        </div>
      </div>
    </div>
    <div class="PlayerHandle">
      <div class="playerBtn" @click="() => musicPlayerList.SwitchMusic(-1)">
        <component :is="ChevronFirst" :size="24"></component>
      </div>
      <div class="playerBtn" @click="() => PlayOrPause()">
        <component :is="!playStatus ? Play : Pause" :size="24"></component>
      </div>
      <div class="playerBtn" @click="() => musicPlayerList.SwitchMusic(1)">
        <component :is="ChevronLast" :size="24"></component>
      </div>
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
        <PlayerList></PlayerList>
      </div>
    </div>
  </div>
</template>

<script setup>
import anime from 'animejs'
import { VolumeOff, Volume1, Volume2, ChevronFirst, ChevronLast } from 'lucide-vue-next'
import { useMusicPlayerListStore } from '@/stores'
import { nextTick, onMounted, ref, watch } from 'vue'
import { Play, Pause } from 'lucide-vue-next'
import dayjs from 'dayjs'
import { useStorage } from '@vueuse/core'
import { throttle } from 'lodash'
const playStatus = ref(false) // 播放状态
const musicPlayerList = useMusicPlayerListStore()
const PlayerControlConfig = useStorage('kugou.PlayerControlConfig', {
  duration: 0,
  currentTime: 0,
  volume: 100
})
const audioElement = ref(null) // 音频元素

let volumeAnimation
const PlayOrPause = throttle((isPlay = false) => {
  const isPlaying = audioElement.value.paused
  if (audioElement.value.src === `http://${window.location.hostname}:${window.location.port}/`) {
    return
  }
  if (isPlaying || isPlay) {
    console.log('PlayOrPause', isPlay)
    audioElement.value.volume = 0
    audioElement.value.currentTime = PlayerControlConfig.value.currentTime
    playStatus.value = true
    volumeAnimation = anime({
      targets: audioElement.value,
      volume: PlayerControlConfig.value.volume / 100,
      duration: 300,
      easing: 'linear'
    })
    audioElement.value.play()
  } else {
    if (volumeAnimation) {
      volumeAnimation.reverse()
      volumeAnimation.play()
      // 等待动画完成后暂停音频
      volumeAnimation.finished.then(() => {
        audioElement.value.pause()
      })
    } else {
      audioElement.value.pause()
    }
    playStatus.value = false
  }
}, 400)
onMounted(() => {
  audioElement.value?.addEventListener('timeupdate', () => {
    PlayerControlConfig.value.currentTime = audioElement.value.currentTime
    PlayerControlConfig.value.duration = audioElement.value.duration
  })
  audioElement.value?.addEventListener('ended', () => {
    console.log('ended')
    PlayerControlConfig.value.currentTime = 0
    musicPlayerList.SwitchMusic()
    // PlayOrPause(true)
  })
})
watch(
  () => musicPlayerList.ActivePlayerMusicInfo,
  async () => {
    await nextTick()
    PlayerControlConfig.value.currentTime = 0
    PlayOrPause(true)
    playStatus.value = true
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
</script>
<style lang="scss" scoped>
.FooterMusicPlayer {
  position: fixed;
  bottom: 0;
  left: 0;
  z-index: 999;
  width: 100vw;
  min-width: 600px;
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
    display: flex;
    align-items: center;
    gap: 10px;
    .playerBtn {
      border: none;
      height: 35px;
      aspect-ratio: 1 / 1;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 10px;
      background-color: transparent;
      transition: all 0.2s;
      &:nth-child(2) {
        height: 45px;
      }
      &:hover {
        background-color: #f2f2f4;
      }
      &:active {
        background-color: #f5f5f5;
      }
    }
  }

  .Handle {
    display: flex;
    align-items: center;
    justify-content: end;
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
