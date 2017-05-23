import Avalonx from 'avalonx'
import user from './modules/user'
import video from './modules/video'

export default new Avalonx.Store({
  ...user,
  modules: {
    video
  }
})
