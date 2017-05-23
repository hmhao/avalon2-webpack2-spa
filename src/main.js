import avalon from './avalon.extend'
import store from './store'
import router from './router'
import App from './App.js'

avalon.config({
  debug: true,
  local: true
})

avalon.bootstrap({
  el: '#app',
  component: App
})