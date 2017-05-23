// 状态事件的回调函数
import { USER } from '@/store/types'
import { cookie } from 'cookie'

const mutations = {
  [USER.LOGIN] (state, data) {
    state.isLogin = true
    if (data) {
      state.user = {
        uid: data.userid,
        nick: data.usernick
      }
      if (data.autoLogin) {
        cookie.set('userid', data.userid),
        cookie.set('usernick', data.usernick)
        cookie.set('autoLogin', 1)
      }
    } else {
      state.user = {
        uid: cookie.get('userid', 0),
        nick: cookie.get('usernick', '')
      }
    }
  },
  [USER.LOGOUT] (state) {
    state.isLogin = false
    state.autoLogin = false
    cookie.set('userid', 0),
    cookie.set('usernick', '')
    cookie.set('autoLogin', 0)
    state.user = {
      uid: '',
      nick: '',
      avatar: ''
    }
  },
  [USER.DATA] (state, data) {
    let user = state.user
    delete data.uid
    avalon.mix(user, data)
  }
}

export default mutations