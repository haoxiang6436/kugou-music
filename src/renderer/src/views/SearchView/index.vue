<template>
  <div class="SearchView">
    <Loading v-if="loading" />
    <div v-else v-auto-animate class="MusicList">
      <SearchResultItem
        v-for="item in AListOfSearchResults"
        :key="item.FileHash"
        :SearchResultsItem="item"
        :PlayerMusic
      ></SearchResultItem>
    </div>
  </div>
</template>

<script setup>
import SearchResultItem from './modules/SearchResultItem.vue'
import { getSearchMusicList } from '@/api/GetMusic.js'
import { onMounted, ref } from 'vue'
import { eventBus } from '@/utils/eventBus'
import { useRoute } from 'vue-router'
const route = useRoute()
const loading = ref(false)
const AListOfSearchResults = ref([])
onMounted(() => {
  performSearch(route.query.keyword)
  eventBus.off('searchKeywordChange')
  eventBus.on('searchKeywordChange', async (keyword) => {
    performSearch(keyword)
  })
})

async function performSearch(keyword) {
  if (loading.value) return
  loading.value = true
  const { data } = await getSearchMusicList(keyword)
  AListOfSearchResults.value = data.lists
  console.log(AListOfSearchResults.value)
  setTimeout(() => {
    loading.value = false
  }, 1500)
}
const PlayerMusic = () => {}
</script>

<style lang="scss" scoped>
.SearchView {
  .MusicList {
    display: flex;
    flex-wrap: wrap;
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
        // $color: #0358fe;
        // $color2: #0357feaf;
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
  }
}
</style>
