<template>
  <div class="PlayListMain">
    <div class="button" @click.stop="IsShow = !IsShow">
      <List />
    </div>
    <Transition>
      <Simplebar v-if="IsShow" ref="playlistRef" class="playerList">
        <ul
          v-if="MusicPlayerListStore.PlayerMusicList.length > 0"
          v-auto-animate
          class="playerListContainer"
        >
          <li
            v-for="(item, index) in MusicPlayerListStore.PlayerMusicList"
            :key="item.FileHash"
            :style="{ '--Delay': index / 10 + 's' }"
            :class="{
              'text-overflow': true,
              active: item?.FileHash === MusicPlayerListStore.ActivePlayerMusicInfo?.FileHash
            }"
            @dblclick="MusicPlayerListStore.SwitchMusic('', item.FileHash)"
          >
            <div class="text">
              <div class="SongName text-overflow">{{ item.SongName }}</div>
              <div class="SingerName text-overflow">{{ item.SingerName }}</div>
            </div>
            <X class="delete" @click.stop="MusicPlayerListStore.DeleteMusic(item)" />
          </li>
        </ul>
        <div v-else class="playerListContainer">
          <div class="text">暂无播放列表</div>
        </div>
      </Simplebar>
    </Transition>
  </div>
</template>

<script setup>
import { List, X } from 'lucide-vue-next'
import { useMusicPlayerListStore } from '@/stores'
import { ref, watch } from 'vue'
const playlistRef = ref(null)
const IsShow = ref(false)
const MusicPlayerListStore = useMusicPlayerListStore()
function handleDocumentClick(e) {
  if (playlistRef.value?.$el && !playlistRef.value?.$el.contains(e.target)) {
    console.log('close')
    IsShow.value = false
  }
}
watch(
  () => IsShow.value,
  (newValue) => {
    if (newValue) {
      document.addEventListener('click', handleDocumentClick)
    } else {
      document.removeEventListener('click', handleDocumentClick)
    }
  }
)
</script>

<style lang="scss" scoped>
.PlayListMain {
  position: relative;
  width: 40px;
  height: 40px;
  .button {
    width: 100%;
    height: 100%;
    border-radius: 5px;
    // background-color: #d4d4d4;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: all 0.2s;
    &:hover {
      background-color: #f2f2f4;
    }
  }
  .playerList {
    $Height: 400px;
    $Width: 400px;
    position: absolute;
    // left: unquote('-') + $Width;
    left: -360px;
    top: -420px;
    // left: 0;
    // top: 0;
    // box-sizing: content-box;
    width: $Width;
    height: $Height;
    border-radius: 10px;
    border: 2px solid #ebebeb;
    // overflow: auto;
    padding: 10px;
    z-index: 1;
    background-color: #fff;
    .playerListContainer {
      display: flex;
      list-style: none;
      flex-flow: column;
      gap: 5px;
      li {
        width: 100%;
        overflow: hidden;
        padding: 10px 15px;
        border-radius: 5px;
        font-size: 14px;
        display: flex;
        align-items: center;
        gap: 8px;
        line-height: 1em;
        transition: all 0.1s;
        transform: translateY(10px);
        opacity: 0;
        animation: identifier 0.3s forwards var(--Delay);
        &:hover {
          background-color: #e0e8f6;
        }
        &.active {
          background-color: #e0e8f6;
          color: #0358fe;
        }
        .text {
          display: flex;
          flex-flow: column;
          gap: 5px;
          color: inherit;
          .SongName,
          .SingerName {
            line-height: 1em;
            width: fit-content;
            color: inherit;
            overflow: hidden;
          }
          .SongName {
            font-weight: bold;
          }
          .SingerName {
            font-size: 10px;
          }
        }
        .delete {
          cursor: pointer;
          margin-left: auto;
          border-radius: 5px;
        }
        @keyframes identifier {
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      }
    }
  }
  .playerListContainer {
    .text {
      line-height: 50px;
      text-align: center;
      color: #292929;
      font-weight: bold;
    }
  }
}
</style>
