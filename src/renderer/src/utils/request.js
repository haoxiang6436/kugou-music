import axios from 'axios'
import { useUserInfoStore } from '@/stores'
import { Message } from '@arco-design/web-vue'
// import { useRouter } from 'vue-router'
if (!window.api?.ServerPORT) {
  window.api = {
    ServerPORT: prompt('请输入服务器端口默认60040') || '60040'
  }
  console.log(window.api.ServerPORT)
}

// 创建axios实例
const instance = axios.create({
  baseURL: `http://localhost:${window.api.ServerPORT}/`,
  // baseURL: 'https://kugouapi.haoxiang6436.top/',
  timeout: 5000
})

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    const userInfoStore = useUserInfoStore()
    // 在发送请求之前做些什么，例如添加token
    const UserInfo = userInfoStore.UserInfo // 假设token存储在localStorage中
    if (UserInfo.token && UserInfo.userid) {
      config.params = {
        ...config.params,
        cookie: `token=${UserInfo.token};userid=${UserInfo.userid}`
      }
    } else {
      // const router = useRouter()
      // router.push('/user')
    }
    return config
  },
  (error) => {
    // 对请求错误做些什么
    return Promise.reject(error)
  }
)

// 响应拦截器
instance.interceptors.response.use(
  (response) => {
    // 对响应数据做点什么
    const { data, status } = response
    if (status === 200) {
      const { status, error_msg } = data
      if (status === 1) {
        return data
      }
      switch (status) {
        case 2:
          Message.error(
            `请求错误(${status}):${error_msg ? error_msg : '身份验证失败（无权限访问）'}`
          )
          break
        case 3:
          Message.error(`请求错误(${status}):${error_msg ? error_msg : '未知错误信息'}`)
          break
        case 4:
          Message.error(`请求错误(${status}):${error_msg ? error_msg : '未知错误信息'}`)
          break
        default:
          Message.error(`请求错误(${status}):${error_msg ? error_msg : '未知错误信息'}`)
      }
      return Promise.reject(new Error(response))
    } else {
      Message.error(
        `请求错误(${status}):${response.data.error_msg ? response.data.error_msg : '未知错误信息'}`
      )
      return Promise.reject(new Error(response))
    }
  },
  (error) => {
    // 对响应错误做点什么，例如根据HTTP状态码处理错误
    // Message.error('网络请求错误，请稍后重试', error.response.status)
    if (error.response) {
      // console.log('errerrerr', !error.response)
      // Message.error('网络请求错误，请稍后重试', error.response.status)
      switch (error.response.status) {
        case 401:
          // 处理未授权的情况
          console.error('Unauthorized')
          break
        case 403:
          // 处理禁止访问的情况
          console.error('Forbidden')
          break
        case 404:
          // 处理资源未找到的情况
          console.error('Not Found')
          break
        case 502:
          // 处理资源未找到的情况
          console.error('502:', error.response.data)
          break
        default:
          console.error('An error occurred:', error.response.data)
      }
    } else if (error.request) {
      // The request was made but no response was received
      console.error('No response received:', error.request)
      Message.error('服务器无响应，请稍后重试')
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error setting up request:', error.message)
    }
    return Promise.reject(error.response)
  }
)

export default instance
