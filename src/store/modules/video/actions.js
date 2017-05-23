import { VIDEO } from '@/store/types'
import ajax from '@/ajax'

const actions = {
  getVideoList ({ state, commit }, params) {
    return ajax({
      url: VIDEO.LIST,
      dataType: 'jsonp',
      jsonp: 'callback',
      data: params
    })
    .done((result) => {
      if(result && result.status == 200){
        commit(VIDEO.LIST, result.data)
      }
    })
    .fail((e) => {
      avalon.log(e)
    })
  }
}

export default actions
