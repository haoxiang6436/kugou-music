<template>
  <ViewContainer class="SearchView">
    <div class="MusicList">
      <div v-if="loading" class="loading">loading</div>
      <SearchResultItem
        v-for="item in AListOfSearchResults"
        :key="item.FileHash"
        :SearchResultsItem="item"
      ></SearchResultItem>
    </div>
  </ViewContainer>
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
  loading.value = true
  console.log(keyword)
  const { data } = await getSearchMusicList(keyword)
  AListOfSearchResults.value = data.lists
  console.log(AListOfSearchResults.value)
  loading.value = false
}
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
/* 当鼠标悬停在滚动条上时改变滚动条的颜色 */
.simplebar-scrollbar:before {
  background-color: #ececec; /* 鼠标悬停时滚动条颜色 */
  // background-color: #8d8d8d; /* 鼠标悬停时滚动条颜色 */
}
</style>
