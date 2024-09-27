import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useMusicPlayerListStore = defineStore(
  'MusicPlayerList',
  () => {
    const CurrentPlayerMusicInfo = ref(null)
    const playerList = ref([])
    const PushPlayerList = (list) => {
      playerList.value.push(...list)
    }
    return { CurrentPlayerMusicInfo, playerList, PushPlayerList }
  },
  {
    persist: {
      key: 'KuGouMusic.MusicPlayerList'
    }
  }
)
