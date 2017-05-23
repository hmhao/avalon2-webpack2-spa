// 状态事件的回调函数
import { VIDEO } from '@/store/types'

const mutations = {
  [VIDEO.LIST] (state, data) {
    state.$list = data
  }
}

export default mutations