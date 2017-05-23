import mutations from './mutations'
import actions from './actions'

export default {
  state: {
    $sort: [{
      key: 'new',
      text: '最新'
    }, {
      key: 'hot',
      text: '最热'
    }],
    sort: 'new',
    $filter: [{
      key: 'all',
      text: '全部',
      value: 0
    }, {
      key: 'upload',
      text: '上传',
      value: 1
    }, {
      key: 'audit',
      text: '审核',
      value: 2
    }, {
      key: 'publish',
      text: '发行',
      value: 3
    }],
    filter: 0,
    $perNum: 4,
    page: -1,
    $list: []
  },
  mutations,
  actions
}
