import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'

const service = axios.create({
  baseURL: '/information-flow',
  // withCredentials: true, // send cookies when cross-domain requests
  timeout: 60000
})

service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['token'] = getToken()
    }
    return config
  },
  error => {
    console.log(error)
    return Promise.reject(error)
  }
)

service.interceptors.response.use(
  response => {
    const res = response
    if (res.data.code === 2000 || res.data.code === 4000) {
      Message({
        message: res.data.error || 'Error',
        type: 'error',
        duration: 5 * 1000
      })
      return Promise.reject(new Error(res.data.error || 'Error'))
    } else {
      return res
    }
  },
  error => {
    const res = error.response
    let errorMessage = res.data.error
    if (res.status === 404) {
      errorMessage = '访问接口不存在!'
    }
    if (res.status === 401) {
      errorMessage === '登录已过期!'
      store.dispatch('user/resetToken').then(() => {
        location.reload()
      })
    }
    if (res.status === 500) {
      errorMessage = '服务器内部错误!'
    }
    console.log('err' + error)
    Message({
      message: errorMessage,
      type: 'error',
      duration: 5 * 1000
    })
    return Promise.reject(error)
  }
)

export default service
