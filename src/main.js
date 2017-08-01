import avalon from './avalon.extend'
import store from './store'
import router from './router'
import App from './App.js'

avalon.config({
  debug: true,
  local: true
})

/* 避免avalon在domready时扫描body将script移出移入dom
 * 导致script重新拉取的问题
 * IE9及以下才有的问题https://github.com/RubyLouvre/avalon/issues/2040
 */
if (avalon.msie && avalon.msie < 10) {
  let childNodes = document.body.childNodes;
  for (let i = childNodes.length - 1, node; i >= 0; i--) {
    node = childNodes[i]
    if (node.nodeName === 'SCRIPT') {
      document.body.removeChild(node)
    }
  }
}
avalon.bootstrap({
  el: '#app',
  component: App
})