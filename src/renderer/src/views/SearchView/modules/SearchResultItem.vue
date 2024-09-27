<template>
  <div
    :key="props.SearchResultsItem.FileHash"
    :class="{
      MusicItem: true,
      nowSing:
        props.SearchResultsItem.FileHash ===
          MusicPlayerListStore.CurrentPlayerMusicInfo?.FileHash &&
        props.SearchResultsItem.SongName === MusicPlayerListStore.CurrentPlayerMusicInfo?.SongName
    }"
    @dblclick="
      () =>
        PlayerMusic(
          props.SearchResultsItem.ResFileHash ||
            props.SearchResultsItem.SuperFileHash ||
            props.SearchResultsItem.SQFileHash ||
            props.SearchResultsItem.HQFileHash ||
            props.SearchResultsItem.FileHash
        )
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
      <div class="AlbumName text-overflow">{{ props.SearchResultsItem.SongName }}</div>
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
const PlayerMusic = async (hash) => {
  console.log(props.SearchResultsItem)

  const data = await getMusicConfigUrl(hash)
  if (data.status !== 1) {
    if (!UserInfoStore.UserInfo?.token) {
      Message.error('请先登录')
      return
    }
    Message.error('此歌曲需要vip')
    return
  }
  MusicPlayerListStore.CurrentPlayerMusicInfo = {
    ...data,
    ...props.SearchResultsItem
  }
  console.log(MusicPlayerListStore.CurrentPlayerMusicInfo)
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
