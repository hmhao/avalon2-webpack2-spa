import { USER } from '@/store/types'
import ajax from '@/ajax'
// 组件内部用来分发 mutations 事件
// 它们接收 store 作为第一个参数，这里是es6的析构
const actions = {
  autoLogin ({ state, commit }) {
    if (state.autoLogin) {
      commit(USER.LOGIN)
      actions.getUserData({ state, commit })
    }
  },
  // 登录
  login: ({ state, commit }, data) => {
    if (!state.isLogin) {
      commit(USER.LOGIN, data)
      actions.getUserData({ state, commit })
    }
  },
  // 登出
  logout: ({ state, commit }) => {
    if (state.isLogin) {
      commit(USER.LOGOUT)
    }
  },
  getUserData ({ state, commit }) {
    return ajax({
      url: USER.DATA,
      dataType: 'jsonp',
      jsonp: 'callback',
      data: {
        uid: state.user.uid
      }
    }).done((result) => {
      if(result && result.status == 200){
        commit(USER.DATA, result.data)
      }
    })
    .fail((e) => {
      avalon.log(e)
    })
  }
}

export default actions
