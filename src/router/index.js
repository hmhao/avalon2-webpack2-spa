import mmRouter from './mmRouter'

avalon.registerComponent({
  name: 'ms-view',
  template: '<div :html="component"></div>',
  data () {
    return {
      component: ''
    }
  },
  methods: {
    onReady: function(e) {
      let router = avalon.router.vm
      this.update(router.route)
      router.$watch('route', (route) => {
        this.update(router.route)
      })
    },
    update: function(route){
      if(route.path !== '/index'){
        this.component = `<xmp :widget="{is: '${route.component}', id: '${route.component}'}"></xmp>`
      }
    }
  }
})

function Router (options) {
  this.$id = 'router';
  this.$routes = {};
  this.route = {};
  this.add = function (route) {
    if(route.redirect){
      avalon.router.when(route.path, route.redirect, function(info){
        let path = (info.path.charAt(0) === '/' ? info.path : '/' + info.path) + info.query
        avalon.router.navigate(path, 2)
      })
    }else{
      this.$routes[route.path] = route
      avalon.router.add(route.path, function() {
        let self = avalon.router.vm
        let route = self.$routes[this.path]
        self.route = {
          path: route.path,// 路由路径
          component: route.component ? route.component.name : ''
        }
        avalon.title.text = route.title
      })
    }
  };

  avalon.ready(()=>{
    (options.routes || []).forEach(route => {
      let html, vm
      if(route.component){
        avalon.registerComponent(route.component)
      }
      this.add(route)
    });
    let vm = avalon.define(this);
    avalon.router.vm = vm;
    avalon.history.start({
      hashPrefix: ''
    });
  })
}

import ListPanel from '../page/ListPanel'
import DropdownPanel from '../page/DropdownPanel'
import TabsPanel from '../page/TabsPanel'
import AccordionPanel from '../page/AccordionPanel'
import TooltipPanel from '../page/TooltipPanel'

export default new Router({
  routes: [
    {
      path: ['/', '/#'],
      redirect: '//index' //必须使用双斜杠,mmRouter的urlFormate过滤掉第一个斜杠
    },
    {
      path: '/index',
      title: '首页'
    },
    {
      path: '/list',
      title: '列表',
      component: ListPanel
    },
    {
      path: '/dropdown',
      title: '下拉菜单',
      component: DropdownPanel
    },
    {
      path: '/tabs',
      title: '标签卡',
      component: TabsPanel
    },
    {
      path: '/accordion',
      title: '手风琴',
      component: AccordionPanel
    },
    {
      path: '/tooltip',
      title: '提示工具',
      component: TooltipPanel
    }
  ]
})
