import { VIDEO } from '@/store/types'
import Mock from 'mockjs'

const data = Mock.mock({
  // 属性 list 的值是一个数组，其中含有 10 到 30 个元素
  'list|10-30': [{
    // 属性 id 是一个自增数，起始值为 1，每次增 1
    'id|+1': 1,
    'title': '@ctitle',
    'poster': '@image("138x78")',
    'create_time': '@datetime("yyyy-MM-dd HH:mm")',
    'status|1-3': 3,
    'plays|100-10000': 100,
    'comments|0-100': 0,
    'checked': false
  }]
}).list


export default {
  [VIDEO.LIST] (dtd) {
    setTimeout(() => dtd.resolve({status:200, data:data}), 100)
  }
}