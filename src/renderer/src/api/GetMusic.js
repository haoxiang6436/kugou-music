import request from '@/utils/request'

export function getMusicConfigUrl(hash) {
  return request({
    url: `/song/url?hash=${hash}`
  })
}
export function getMusicDetails(hash) {
  return request({
    url: `/privilege/lite?hash=${hash}`
  })
}
export function getSearchMusicList(SearchWord) {
  return request({
    url: `/search?keywords=${SearchWord}`
  })
}
