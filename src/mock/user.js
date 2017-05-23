import { USER } from '@/store/types'


const data = {
  "uid": "123456",
  "nick": "厉害了"
}

export default {
  [USER.DATA] (dtd) {
    setTimeout(() => dtd.resolve({status:200, data:data}), 100)
  }
}