import mmRouter from './mmRouter'
import view from './components/view'
import link from './components/link'

avalon.registerComponent(view)
avalon.registerComponent(link)

function Router (options) {
  if (!(this instanceof Router)) {
    return new Router(options)
  }
  let self = avalon.mix(avalon.router, Router.prototype)

  self.routes = {}
  self.options = options
  self.watchers = []
  self.beforeHooks = []
  self.resolveHooks = []
  self.afterHooks = []
  self.route = null

  avalon.ready(()=>{
    (options.routes || []).forEach(route => self.register(route))
    avalon.history.start({
      hashPrefix: ''
    })
  })
  return self
}

Router.prototype.subscribe = function (cb) {
  this.watchers.push(cb)
  if (this.route) {
    cb(this.route)
  }
}

Router.prototype.unsubscribe = function (cb) {
  for (let cbs = this.watchers, i = cbs.length - 1; i >= 0; i--) {
    if (cbs[i] === cb) {
      cbs.splice(i, 1)
    }
  }
}

Router.prototype.dispatch = function (route) {
  route = route || this.route
  this.watchers.forEach(watcher => watcher(route))
}

Router.prototype.register = function (route) {
  if(route.component){
    avalon.registerComponent(route.component)
  }
  if(route.redirect){
    avalon.router.when(route.path, route.redirect, function(info){
      let path = (info.path.charAt(0) === '/' ? info.path : '/' + info.path) + info.query
      avalon.router.navigate(path, 2)
    })
  }else{
    let self = this
    self.routes[route.path] = route
    avalon.router.add(route.path, function() {
      let route
      avalon.each(self.routes, (path) => {
        if (this.regexp.test(path)) {
          route = self.routes[path]
          return false
        }
      })
      if (!route) return
      if (route.title)
        avalon.title.text = route.title
      
      let matched = []
      let lazy = []
      let component, componentName
      do {
        component = route.component
        componentName = component && component.name || ''
        if (avalon.isFunction(component)) {
          if (!component.loadedName) {
            lazy[matched.length] = component
          } else {
            componentName = component.loadedName
          }
        }
        componentName && matched.push(componentName)
      } while (route = route.parent)

      lazyload(lazy, matched, () => {
        matched.reverse()
        avalon.router.route = avalon.mix({depth: 0, matched}, this)
        self.dispatch()
      })
    })
  }
  if (route.children && route.children.length) {
    route.children.forEach((childRoute) => {
      childRoute.parent = route
      childRoute.path = route.path + '/' + childRoute.path
      this.register(childRoute)
    })
  }
}

function lazyload (lazy, matched, next) {
  if (lazy.length) {
    let loads = []
    lazy.forEach((getComponent, index) => {
      loads.push(new Promise(getComponent)
        .then(function(module){
          let component = module['default']
          avalon.registerComponent(component)
          matched[index] = component.name
          getComponent.loadedName = component.name
        })
      )
    })
    Promise.all(loads)
      .then(next)
  } else {
    next()
  }
}

export default Router