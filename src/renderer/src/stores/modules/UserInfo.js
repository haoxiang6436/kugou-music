import { ref } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore(
  'UserInfoStore',
  () => {
    const UserInfo = ref({})
    return { UserInfo }
  },
  {
    persist: {
      key: 'KuGouMusic.UserInfo'
    }
  }
)
