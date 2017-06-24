import avalon from 'avalon2'

function readyHook(onReady, component){
  return function(){
    avalon.each(component.watch, (k, v) => {
      this['$$unwatch'].push(this.$watch(k, v))
    })

    let dirs = this.$render.directives.concat()
    let dir, comp
    while(dirs.length){//采用先序遍历
      dir = dirs.shift()
      if (dir.type == 'ref') {//是引用指令
        dir.node.ref = dir.expr
      } else if (dir.type == 'widget') {//是组件指令
        if (dir.node.ref) {
          // 判断该子组件是否属于当前组件
          avalon.each(component.components, (i, comp) => {
            if (comp.name == dir.is) {
              this.$$ref[dir.node.ref] = dir.comVm
              return false
            }
          })
          delete dir.node.ref
        }
        // 根据子组件定义的事件自动绑定到当前组件的方法
        avalon.each(component.components, (i, comp) => {
          if (comp.name == dir.is && comp.events) {
            avalon.each(comp.events, (j, event) => {
              dir.comVm[event] = this[event] || avalon.noop
            })
          }
        })
        if (dir.innerRender) {
          // 如果不匹配组件则将其directives加入遍历队列
          dirs = dirs.concat(dir.innerRender.directives) 
        }
      }
    }
    onReady && onReady.call(this)
  }
}

function disposeHook(onDispose, component){
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

  if(component.computed){
    data.$computed = avalon.mix(data.$computed || {}, component.computed)
    delete component.computed
  }
  if(component.props){
    avalon.mix(data, component.props)
    delete component.props
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
  data['$$unwatch'] = []
  data.onReady = readyHook(data.onReady, component)
  data.onDispose = disposeHook(data.onDispose, component)
  avalon.each(component.components, (key, comp) => {
    avalon.registerComponent(comp)// 注册组件
  })

  if(component.directives){
    avalon.each(component.directives, (key, directive) => {
      avalon.registerDirective(directive)// 注册指令
    })
  }
  
  if(avalon.store){
    data.$store = avalon.store
  }
  data['$$component'] = component.name
  component.defaults = data
  avalon.component(component.name, component)
}

avalon.registerDirective = function(directive) {
  avalon.directive(directive.name, directive)
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

let avalonDefine = avalon.define
avalon.define = function (definition) {
  let componentName = definition['$$component']
  let component
  if (componentName) {
    component = avalon.components[componentName]
    if (component.beforeCreate) {
      component.beforeCreate.call(definition)
    }
  }
  let vm = avalonDefine.call(avalon, definition)
  if (component && component.afterCreate) {
    component.afterCreate.call(vm)
  }
  return vm
}

let matchExpr = /^([.#])?([\w-]*)$/
avalon.fn.mix({
  is (expr) {
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
  parent (selector) {
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
  sibling (selector) {
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
  },
  one (type, fn, phase) {
    if (this[0]) {
      let handle = (e) => {  
        fn(e)
        avalon.unbind(this[0], type, handle)
      }  
      return avalon.bind(this[0], type, handle, phase);
    }
  }  
})

avalon.support = {
  transition: (function () {
    let transitionEnd = (function () {
      let el = document.createElement('transition'),
          transEndEventNames = {
             'WebkitTransition' : 'webkitTransitionEnd',
             'MozTransition'    : 'transitionend',
             'OTransition'      : 'oTransitionEnd otransitionend',
             'transition'       : 'transitionend'
          },
          name
      for (name in transEndEventNames){
        if (el.style[name] !== undefined) {
          return transEndEventNames[name]
        }
      }
    })()
    return transitionEnd && {
      end: transitionEnd
    }
  })()
}

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