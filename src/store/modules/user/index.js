import mutations from './mutations'
import actions from './actions'
import { cookie } from 'cookie'

export default {
  state: {
    isLogin: false,
    autoLogin: cookie.get('autoLogin') == '1',
    user: {
      uid: '',
      nick: '',
      avatar: ''
    }
  },
  mutations,
  actions
}