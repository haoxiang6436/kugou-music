<template>
  <Transition>
    <div v-if="LoginViewShow" class="LoginView flex" @click="LoginViewShow = false">
      <div class="login-container flex" @click.stop>
        <h1>扫码登录</h1>
        <div class="QRCode"><img :src="QRcode.URL" width="100%" height="100%" alt="" /></div>
        <h2>{{ StatusList[QRcode.Status] }}</h2>
        <a-button v-if="UserInfoStore.isLogin" @click="ExitLogin">退出登录</a-button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, watch } from 'vue'
import { eventBus } from '@/utils/eventBus'
import { getLoginQRCode, getLoginQRCodeStatus } from '@/api/UserInfo'
import { useUserInfoStore } from '@/stores'
const UserInfoStore = useUserInfoStore()
const { setLogin, removeLogin } = UserInfoStore
const StatusList = ['过期', '等待扫码', '等待确认', '', '授权成功']

let timer = null
const QRcode = ref({
  URL: '',
  Status: 0,
  ID: ''
})
const LoginViewShow = ref(false)
eventBus.on('login', async () => {
  LoginViewShow.value = true
})
const ExitLogin = () => {
  removeLogin()
  QRcode.value = {
    URL: '',
    Status: 3,
    ID: ''
  }
  getQRCode()
}
const getQRCode = async () => {
  if (UserInfoStore.isLogin) {
    console.log('已登录')
    QRcode.value.Status = 4
    QRcode.value.URL = UserInfoStore.UserInfo?.pic
    return
  }
  console.log('登录')
  const { data } = await getLoginQRCode()
  QRcode.value.ID = data.qrcode
  QRcode.value.URL = data.qrcode_img
  checkQRCodeStatus()
}
const checkQRCodeStatus = async () => {
  clearTimeout(timer)
  const { data } = await getLoginQRCodeStatus(QRcode.value.ID)
  QRcode.value.Status = data.status
  switch (data.status) {
    case 0:
      getQRCode()
      break
    case 1:
      timer = setTimeout(() => {
        checkQRCodeStatus()
      }, 2000)
      break
    case 2: // 等待确认登录
      QRcode.value.URL = data.pic
      timer = setTimeout(() => {
        checkQRCodeStatus()
      }, 2000)
      break
    case 3:
      break
    case 4:
      setLogin(data)
      QRcode.value.URL = data.pic
      clearTimeout(timer)
      setTimeout(() => (LoginViewShow.value = false), 1500)
      break
    default:
      clearTimeout(timer)
      break
  }
}
watch(
  () => LoginViewShow.value,
  (newValue) => {
    if (!newValue) {
      clearTimeout(timer)
      timer = null
    } else {
      // eventBus.off('login')
      getQRCode()
    }
  }
)
</script>

<style lang="scss" scoped>
.LoginView {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;
  background-color: rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  padding: 80px;
  .login-container {
    width: 450px;
    height: 500px;
    border-radius: 10px;
    background-color: #fff;
    box-shadow: 5px 5px 15px #eee;
    -webkit-app-region: no-drag;
    flex-flow: column;
    h1 {
      line-height: 1.5em;
      margin: 0;
      margin-bottom: 20px;
    }
    .QRCode {
      width: 260px;
      height: 260px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: all 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
  transform: scale(1.05);
}
</style>
