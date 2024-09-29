import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useMusicPlayerListStore = defineStore(
  'MusicPlayerList',
  () => {
    const active = ref(0)
    const PlayerMusicList = ref([])
    const ActivePlayerMusicInfo = computed(() => PlayerMusicList.value[active.value])
    const SwitchMusic = (index = 1, FileHash = null) => {
      if (FileHash) {
        active.value = PlayerMusicList.value.findIndex((i) => i.FileHash === FileHash)
        return
      }
      const i = active.value + index
      if (i < PlayerMusicList.value.length && i >= 0) {
        active.value = i
      } else if (i === PlayerMusicList.value.length) {
        active.value = 0
      } else if (i < 0) {
        active.value = PlayerMusicList.value.length - 1
      }
    }
    const addPlayerMusic = (musicInfo) => {
      console.log('添加', musicInfo.hash)
      const is = PlayerMusicList.value.findIndex((i) => i.FileHash === musicInfo.FileHash)
      // 删除数组项
      if (is !== -1) {
        PlayerMusicList.value.splice(is, 1)
      }
      PlayerMusicList.value.push(musicInfo)
      active.value = PlayerMusicList.value.length - 1
    }
    const DeleteMusic = (item) => {
      const is = PlayerMusicList.value.findIndex(
        (i) => i.FileHash === item.FileHash && i.Audioid === item.Audioid
      )
      if (is !== -1) {
        if (active.value >= PlayerMusicList.value.length - 1) {
          SwitchMusic(-1)
        }
        PlayerMusicList.value.splice(is, 1)
      }
    }
    return {
      PlayerMusicList,
      ActivePlayerMusicInfo,
      active,
      addPlayerMusic,
      SwitchMusic,
      DeleteMusic
    }
  },
  {
    persist: {
      key: 'KuGouMusic.MusicPlayerList'
    }
  }
)
