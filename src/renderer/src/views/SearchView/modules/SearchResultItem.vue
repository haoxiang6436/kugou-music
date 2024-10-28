<template>
  <div
    :key="props.SearchResultsItem.FileHash"
    :class="{
      MusicItem: true,
      nowSing:
        props.SearchResultsItem.FileHash === MusicPlayerListStore.ActivePlayerMusicInfo?.FileHash &&
        props.SearchResultsItem.SongName === MusicPlayerListStore.ActivePlayerMusicInfo?.SongName &&
        props.SearchResultsItem.SingerName ===
          MusicPlayerListStore.ActivePlayerMusicInfo?.SingerName
    }"
    @dblclick="
      () =>
        PlayerMusic([
          props.SearchResultsItem.ResFileHash,
          props.SearchResultsItem.SuperFileHash,
          props.SearchResultsItem.SQFileHash,
          props.SearchResultsItem.HQFileHash,
          props.SearchResultsItem.FileHash
        ])
    "
  >
    <img
      :src="
        props.SearchResultsItem.Image.replace(/\{size\}/g, '480')
          ? props.SearchResultsItem.Image.replace(/\{size\}/g, '480')
          : 'http://imge.kugou.com/stdmusic/{size}/20240829/20240829113822548206.jpg'
      "
      alt=""
    />
    <div class="info">
      <div
        class="AlbumName text-overflow"
        :title="props.SearchResultsItem.SongName + props.SearchResultsItem.Suffix"
      >
        {{ props.SearchResultsItem.SongName + props.SearchResultsItem.Suffix }}
      </div>
      <div class="SingerName text-overflow">{{ props.SearchResultsItem.SingerName }}</div>
    </div>
  </div>
</template>

<script setup>
import { getMusicConfigUrl } from '@/api/GetMusic.js'
import { useUserInfoStore, useMusicPlayerListStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
const UserInfoStore = useUserInfoStore()
const MusicPlayerListStore = useMusicPlayerListStore()
const props = defineProps(['SearchResultsItem'])
const SoundQualityEnumeration = ['Res', 'Super', 'SQ', 'HQ', 'Standard']
const PlayerMusic = async (hash, index = 0) => {
  let data
  try {
    // 判断音质hash空值
    if (!hash[index] && index >= 0 && index <= 4) {
      PlayerMusic(hash, index + 1)
      return
    }
    // 发起请求获取音乐url
    data = await getMusicConfigUrl(hash[index])
    Message.success(
      `正在播放:${props.SearchResultsItem.SongName}(${SoundQualityEnumeration[index]})`
    )
    MusicPlayerListStore.addPlayerMusic({
      ...data,
      ...props.SearchResultsItem
    })
    console.log(MusicPlayerListStore.ActivePlayerMusicInfo)
  } catch (response) {
    // 请求url失败
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
</script>

<style lang="scss" scoped>
.MusicItem {
  width: 260px;
  height: 70px;
  margin: 5px 10px;
  padding-left: 10px;
  // background-color: #f5f5f7;
  $color: #292929;
  $color2: #5f5f5f;
  transition: all 0.1s;
  border-radius: 10px;
  display: flex;
  align-items: center;
  overflow: hidden;
  gap: 10px;
  &.nowSing {
    background-color: #e0e8f6;
    .AlbumName {
      color: #0358fe;
    }
    .SingerName {
      color: #0357feaf;
    }
  }
  img {
    border-radius: 10px;
    width: 50px;
  }
  .AlbumName {
    width: 180px;
    font-size: 1.1em;
    font-weight: bold;
    overflow: hidden; /* 隐藏溢出部分 */
    color: $color;
  }
  .SingerName {
    width: 180px;
    font-size: 0.8em;
    color: #4f4f4f;
    font-weight: bold;
    overflow: hidden; /* 隐藏溢出部分 */
    color: $color2;
  }
  &:hover {
    background-color: #e0e8f6;
  }
}
</style>
