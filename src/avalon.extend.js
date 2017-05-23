import promise from 'es6-promise'
import avalon from 'avalon2'

promise.polyfill()

function readyHook(onReady, watch, componentRef){
  return function(){
    avalon.each(watch, (i, w) => {
      this['$$unwatch'].push(this.$watch(w.key, w.fn))
    })
    avalon.each(componentRef, (i, comp) => {
      let ref = this['$$ref'][comp.$$ref]
      if(ref.id){
        ref = this['$$ref'][comp.$$ref] = avalon.vmodels[ref.id]
      }else{
        let dirs = this.$render.directives.concat()
        let dir
        while(dirs.length){//采用先序遍历
          dir = dirs.shift()
          if(dir.is){//是组件
            if(dir.is === comp.component.name){
              // 将组件定义的$$ref名指向对应的组件vm
              ref = this['$$ref'][comp.$$ref] = dir.comVm 
              break
            }
            // 如果不匹配组件则将其directives加入遍历队列
            dirs = dirs.concat(dir.innerRender.directives) 
          }
        }
      }
      if(ref){
        avalon.each(comp.events, (j, event) => {
          ref[event] = this[event]
        })
      }
    })
    onReady && onReady.call(this)
  }
}

function disposeHook(onDispose){
  return function(){
    let unwatch
    while (this['$$unwatch'].length) {
      unwatch = this['$$unwatch'].pop()
      unwatch()
    }
    onDispose && onDispose.call(this)
  }
}

avalon.registerComponent = function(component) {
  if(avalon.components[component.name]) return

  let data = component.data || component.defaults
  delete component.data
  data = avalon.isFunction(data) ? data() : data || {}
  if (!avalon.isPlainObject(data)) {
    data = {}
    avalon.warn(component.name + ' >> data functions should return an object')
  }

  let watch = []
  let componentRef = []
  if(component.computed){
    data.$computed = avalon.mix(data.$computed || {}, component.computed)
    delete component.computed
  }
  if(component.props){
    avalon.mix(data, component.props)
    delete component.props
  }
  if(component.watch){
    avalon.each(component.watch, (key, fn) => {
      watch.push({key, fn})// 留到onReady时添加监听
    })
    delete component.watch
  }
  if(component.methods){
    avalon.mix(data, component.methods)
    delete component.methods
  }
  if(component.events && component.events.length){
    avalon.each(component.events, (i, event) => {
      data[event] = avalon.noop
    })
  }
  if(component.filters){
    avalon.each(component.filters, (filter, fn) => {
      if(!avalon.filters[filter]){
        avalon.filters[filter] = fn
      }
    })
    delete component.filters
  }
  data['$$ref'] = {}
  avalon.each(component.components, (key, component) => {
    let comp = component
    if (comp.$$ref) {
      let ref = avalon.mix(data[comp.$$ref] || {}, {
        is: comp.component.name
      }, comp.props)
      data['$$ref'][comp.$$ref] = ref
      componentRef.push(comp)// 留到onReady时添加监听
      comp = comp.component
    }
    avalon.registerComponent(comp)// 注册组件
  })
  data['$$unwatch'] = []
  if (watch.length || componentRef.length) {
    data.onReady = readyHook(data.onReady, watch, componentRef)
    data.onDispose = disposeHook(data.onDispose)
  }

  if(avalon.store){
    data.$store = avalon.store
  }
  component.defaults = data
  avalon.component(component.name, component)
}

avalon.bootstrap = function(options) {
  if(!options.el || !options.component) {
    avalon.error('avalon.bootstrap需要提供el和component参数')
  }
  let el = options.el.replace(/^#/, '')
  let component = options.component
  avalon.registerComponent(component)
  let vm = avalon.define({
    $id: 'root',
    $store: avalon.store || ''
  })
  let template = `<xmp :controller="${vm.$id}" :widget="{is: '${component.name}', id: '${component.name}'}"></xmp>`
  let root = document.getElementById(el)
  avalon.innerHTML(root, template)
}

let matchExpr = /^([.#])?([\w-]*)$/
avalon.fn.mix({
  is: function (expr) {
    let isMatch = false
    let match = matchExpr.exec(expr)
    if(match){
      switch (match[1]){
        case '.': isMatch = this.hasClass(match[2]);break;
        case '#': isMatch = this.attr('id') == match[2];break;
        default: isMatch = new RegExp(match[2], 'i').test(this.element.tagName);
      }
    }
    return isMatch
  },
  parent: function (selector) {
    let elem = this.element
    let msElem
    if(elem){
      while((elem = elem.parentNode) && elem.nodeType !== 9) {
        if (elem.nodeType === 1) {
          msElem = avalon(elem)
          if(!selector || msElem.is(selector)){
            return msElem
          }
        }
      }
    }
    return avalon(null)
  },
  sibling: function(selector) {
    let elem = this.element
    let n = elem
    let msElem
    if(elem){
      for (; n; n = n.nextSibling) {
        if (n.nodeType === 1 && n !== elem) {
          msElem = avalon(n)
          if(!selector || msElem.is(selector)){
            return msElem
          }
        }
      }
    }
    return avalon(null)
  }
});

var keys = {
  esc: 27,
  tab: 9,
  enter: 13,
  space: 32,
  del: 46,
  up: 38,
  left: 37,
  right: 39,
  down: 40
};
for (var name$1 in keys) {
  (function (filter, key) {
    avalon.filters[filter] = function (e) {
      e.$return = e.which !== key;
      return e;
    };
  })(name$1, keys[name$1]);
}

export default avalon