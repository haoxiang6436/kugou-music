import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useUserInfoStore = defineStore(
  'UserInfoStore',
  () => {
    const UserInfo = ref({})
    const setLogin = (userInfo) => {
      UserInfo.value = userInfo
    }
    const removeLogin = () => {
      UserInfo.value = {}
    }
    const isLogin = computed(() => {
      return UserInfo.value?.token
    })
    return { UserInfo, isLogin, removeLogin, setLogin }
  },
  {
    persist: {
      key: 'KuGouMusic.UserInfo'
    }
  }
)
