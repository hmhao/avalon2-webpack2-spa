let template = 
`
<ul class="nav nav-pills nav-stacked">
  <li :for="nav in navs" :class="{active: nav.active}">
    <a :attr="{href:'#!' + nav.path}">{{nav.title}}</a>
  </li>
</ul>
`

export default {
  name: 'ms-nav',
  template,
  data () {
    return {
      navs: [{
        title: '列表',
        path: '/list',
        active: false
      },{
        title: '下拉菜单',
        path: '/dropdown',
        active: false
      }]
    }
  },
  methods: {
    onReady () {
      let router = avalon.router.vm
      this.update(router.route)
      router.$watch('route', (route) => {
        this.update(router.route)
      })
    },
    update (route){
      let path = route.path
      avalon.each(this.navs, (i, nav)=>{
        nav.active = path === nav.path
      })
    }
  }
}
