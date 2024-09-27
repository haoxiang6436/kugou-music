<template>
  <Transition>
    <div v-if="LoginViewShow" class="LoginView flex" @click="LoginViewShow = false">
      <div class="login-container flex" @click.stop>
        <h1>扫码登录</h1>
        <div class="QRCode"><img :src="QRcode.URL" width="100%" height="100%" alt="" /></div>
        <h2>{{ StatusList[QRcode.Status] }}</h2>
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
const StatusList = ['过期', '等待扫码', '等待确认', '', '授权成功']
let timer = null
const QRcode = ref({
  URL: '',
  Status: 0,
  ID: ''
})
const LoginViewShow = ref(false)
eventBus.on('login', async () => {
  console.log('showLogin')
  LoginViewShow.value = true
})
const getQRCode = async () => {
  const { data } = await getLoginQRCode()
  QRcode.value.ID = data.qrcode
  QRcode.value.URL = data.qrcode_img
  checkQRCodeStatus()
}
const checkQRCodeStatus = async () => {
  clearTimeout(timer)
  const { data } = await getLoginQRCodeStatus(QRcode.value.ID)
  QRcode.value.Status = data.status
  if (data.status === 4) {
    // 授权成功
    UserInfoStore.UserInfo = data
    console.log(UserInfoStore.UserInfo)
    QRcode.value.URL = data.pic
    clearTimeout(timer)
  } else if (data.status === 1 || data.status === 2) {
    timer = setTimeout(() => {
      checkQRCodeStatus()
    }, 2000)
  } else {
    clearTimeout(timer)
  }
}
watch(
  () => LoginViewShow.value,
  (newValue) => {
    if (!newValue) {
      clearTimeout(timer)
      timer = null
    } else {
      getQRCode()
    }
  }
)
</script>

<!-- <script setup>
import { useUserInfoStore } from '@/stores'
import { getLoginQRCode, getLoginQRCodeStatus, getUserVipInfo } from '@/api/UserInfo'
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
const router = useRouter()
const StatusList = ['过期', '等待扫码', '等待确认', '', '授权成功']
const Status = ref()
const QRcodeID = ref('')
const QRcodeURL = ref('')
let timer = null
const UserInfoStore = useUserInfoStore()
const getQRCode = async () => {
  const { data } = await getLoginQRCode()
  QRcodeID.value = data.qrcode
  QRcodeURL.value = data.qrcode_img
  checkQRCodeStatus()
}
const checkQRCodeStatus = async () => {
  clearTimeout(timer)
  const { data } = await getLoginQRCodeStatus(QRcodeID.value)
  Status.value = data.status
  if (data.status === 4) {
    const UserInfoStore = useUserInfoStore()
    // 授权成功
    UserInfoStore.UserInfo = data
    console.log(UserInfoStore.UserInfo)
    QRcodeURL.value = data.pic
    clearTimeout(timer)
    router.push('/')
    timer = null
  } else if (data.status === 1 || data.status === 2) {
    timer = setTimeout(() => {
      checkQRCodeStatus()
    }, 2000)
  } else {
    clearTimeout(timer)
  }
}
const Login = async () => {
  if (!UserInfoStore.UserInfo?.token) {
    console.log(UserInfoStore.UserInfo.token)
    console.log('未登录')
    getQRCode()
  } else {
    console.log('已登录')
    Status.value = 4
    QRcodeURL.value = UserInfoStore.UserInfo.pic
    console.log(UserInfoStore.UserInfo.token)
    console.log(UserInfoStore.UserInfo.userid)
  }
}
const ExitLogin = () => {
  console.log('退出登录')
  UserInfoStore.UserInfo = {}
  Login()
}
const GetVip = async () => {
  // const {
  //   data: { dfid }
  // } = await getDfid()
  const data = await getUserVipInfo()
  console.log('获取vip', data)
}
onMounted(() => {
  if (UserInfoStore.UserInfo.token && UserInfoStore.UserInfo.userid) {
    Status.value = 4
    QRcodeURL.value = UserInfoStore.UserInfo.pic
  } else {
    Login()
  }
})
</script> -->

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
      width: 300px;
      height: 300px;
      border-radius: 10px;
      overflow: hidden;
    }
  }
}
/* 下面我们会解释这些 class 是做什么的 */
.v-enter-active,
.v-leave-active {
  transition: opacity 0.3s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
