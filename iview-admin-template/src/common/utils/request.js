import axios from 'axios'
import { Notice, Modal } from 'iview'
import store from '../../store'
import { getToken } from '@/common/utils/auth'
import { BASE_URL, SUCCESS_CODE, INVALID_TOKEN, TIME_OUT } from '../../config'

// 创建axios实例
const service = axios.create({
  baseURL: BASE_URL, // api 的 base_url
  timeout: TIME_OUT // 请求超时时间
})

// request拦截器
service.interceptors.request.use(
  config => {
    if (store.getters.token) {
      config.headers['X-Token'] = getToken() // 让每个请求携带自定义token 请根据实际情况自行修改
    }
    return config
  },
  error => {
    // Do something with request error
    console.log(error) // for debug
    Promise.reject(error)
  }
)

// response 拦截器
service.interceptors.response.use(
  response => {
    /**
     * code为非20000是抛错 可结合自己业务进行修改
     */
    const res = response.data
    if (res.code !== SUCCESS_CODE) {
      Notice.error({
        title: res.message,
        duration: 5
      })

      if (res.code === INVALID_TOKEN) {
        Modal.confirm({
          title: '登出',
          content: '你已被登出，可以取消继续留在该页面，或者重新登录',
          okText: '重新登录',
          cancelText: '取消',
          onOk: () => {
            store.dispatch('FedLogOut').then(() => {
              location.reload() // 为了重新实例化vue-router对象 避免bug
            })
          }
        })
      }
      return Promise.reject('error')
    } else {
      return res
    }
  },
  error => {
    console.log('err' + error) // for debug
    Notice.error({
      title: error.message,
      duration: 5
    })
    return Promise.reject(error)
  }
)

export default service
