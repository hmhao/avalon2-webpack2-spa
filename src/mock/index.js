import user from './user'
import video from './video'

export default {
  ...user,
  ...video,
  get (url, dtd) {
    if(url && this[url]){
      return this[url](dtd)
    }else{
      return dtd.reject({status:404, data:{}})
    }
  }
}