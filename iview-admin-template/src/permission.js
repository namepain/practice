import router from './router'
import store from './store'
import iView from 'iview'
import { getToken } from '@/common/utils/auth' // 验权

const whiteList = ['/login'] // 不重定向白名单

router.beforeEach((to, from, next) => {
  iView.LoadingBar.start()
  if (getToken()) {
    if (to.path === '/login') {
      next({ path: '/' })
      iView.LoadingBar.finish() // if current page is dashboard will not trigger afterEach hook, so manually handle it
    } else {
      if (store.getters.roles.length === 0) {
        store.dispatch('GetInfo').then(res => { // 拉取用户信息
          next()
        }).catch((err) => {
          console.log(err)
          store.dispatch('FedLogOut').then(() => {
            next({ path: '/' })
          })
        })
      } else {
        next()
      }
    }
  } else {
    if (whiteList.indexOf(to.path) !== -1) {
      next()
    } else {
      next(`/login?redirect=${to.path}`) // 否则全部重定向到登录页
      iView.LoadingBar.finish()
    }
  }
})

router.afterEach(() => {
  iView.LoadingBar.finish() // 结束LoadingBar
})
