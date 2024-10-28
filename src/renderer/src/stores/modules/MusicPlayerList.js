import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { Message } from '@arco-design/web-vue'
import { useUserInfoStore } from '@/stores'
import { getMusicConfigUrl } from '@/api/GetMusic.js'

export const useMusicPlayerListStore = defineStore(
  'MusicPlayerList',
  () => {
    const activeAudioid = ref(0)
    const PlayerMusicList = ref([])
    const ActivePlayerMusicInfo = computed(() =>
      PlayerMusicList.value.find((i) => i.Audioid === activeAudioid.value)
    )
    /**
     * 切换音乐播放
     *
     * 此函数用于切换当前播放的音乐索引如果提供了FileHash，则会根据FileHash定位到特定的音乐并播放；
     * 否则，它会根据提供的索引值在当前播放列表中切换音乐
     *
     * @param {number} index - 需要切换的音乐索引偏移量默认为1，表示播放下一首当index为负数时，表示播放上一首
     * @param {string|null} FileHash - 音乐文件的唯一哈希值如果提供，将定位到此文件并播放默认为null
     */
    const SwitchMusic = (index = 1, FileHash = null) => {
      // 当提供了FileHash时，查找对应音乐的索引并播放
      if (FileHash) {
        activeAudioid.value = PlayerMusicList.value.find((i) => i.FileHash === FileHash).Audioid
        return
      }
      // if (!(index === -1 && index === 1)) return
      // 计算新的音乐索引
      const i = getActiveMusicIndex() + index
      // 当新索引在播放列表有效范围内时，更新当前播放音乐索引
      if (i < PlayerMusicList.value.length && i >= 0) {
        SwitchIndex(i)
        // 当新索引等于播放列表长度时，循环播放到列表第一首
      } else if (i === PlayerMusicList.value.length) {
        SwitchIndex(0)
        // 当新索引为负数时，循环播放到列表最后一首
      } else if (i < 0) {
        SwitchIndex(PlayerMusicList.value.length - 1)
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
      SwitchIndex(PlayerMusicList.value.length - 1)
    }
    const DeleteMusic = (item) => {
      const activeIndex = getActiveMusicIndex()
      const is = PlayerMusicList.value.findIndex(
        (i) => i.FileHash === item.FileHash && i.Audioid === item.Audioid
      )
      if (is !== -1) {
        if (getActiveMusicIndex() >= PlayerMusicList.value.length - 1) {
          SwitchMusic(-1)
        }
        PlayerMusicList.value.splice(is, 1)
        if (activeIndex >= PlayerMusicList.value.length)
          SwitchIndex(PlayerMusicList.value.length - 1)
        if (activeIndex <= 0) SwitchIndex(0)
        SwitchIndex(activeIndex)
      }
    }
    const getActiveMusicIndex = () => {
      return PlayerMusicList.value.findIndex((i) => i.Audioid === activeAudioid.value)
    }
    function SwitchIndex(index) {
      activeAudioid.value = PlayerMusicList.value[index].Audioid
    }
    const PlayerMusic = async (
      hash = [
        ActivePlayerMusicInfo.value.ResFileHash,
        ActivePlayerMusicInfo.value.SuperFileHash,
        ActivePlayerMusicInfo.value.SQFileHash,
        ActivePlayerMusicInfo.value.HQFileHash,
        ActivePlayerMusicInfo.value.FileHash
      ],
      index = 0
    ) => {
      const UserInfoStore = useUserInfoStore()
      let data
      try {
        // 判断音质hash空值
        if (!hash[index] && index >= 0 && index <= 4) {
          PlayerMusic(hash, index + 1)
          return
        }
        // 发起请求获取音乐url
        data = await getMusicConfigUrl(hash[index])
        let findIndex = PlayerMusicList.value.findIndex(
          (i) =>
            i.FileHash === ActivePlayerMusicInfo.value.FileHash &&
            i.Audioid === ActivePlayerMusicInfo.value.Audioid
        )
        console.log(findIndex)
        if (findIndex !== -1) {
          PlayerMusicList.value[findIndex].url = {
            ...data.url
          }
        }
      } catch (response) {
        // 请求url失败
        console.log('请求url失败')
        if (response.status === 502) {
          if (response.data.status === 2) {
            if (!UserInfoStore.UserInfo?.token) {
              Message.error('请先登录')
              return
            }
            // vip
            if (index >= 0 && index < 4) {
              PlayerMusic(hash, index + 1)
            } else {
              Message.error('你还不是VIP')
            }
          } else {
            Message.error('网络错误，请检查网络')
          }
        }
      }
    }
    return {
      PlayerMusicList,
      ActivePlayerMusicInfo,
      addPlayerMusic,
      SwitchMusic,
      DeleteMusic,
      PlayerMusic
    }
  },
  {
    persist: {
      key: 'KuGouMusic.MusicPlayerList'
    }
  }
)
