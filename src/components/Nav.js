let template = 
`
<ul class="nav nav-pills nav-stacked">
  <li :for="nav in navs" :class="{active: nav.active}">
    <a :attr="{href:'#!' + nav.path}">
      {{nav.title}}
    </a>
  </li>
</ul>
`

let navDefault = {
  title: '',
  path: '',
  active: false
}

export default {
  name: 'ms-nav',
  template,
  data () {
    return {
      navs: [{
        title: '列表(表格)',
        path: '/list'
      },{
        title: '下拉菜单',
        path: '/dropdown'
      },{
        title: '标签卡',
        path: '/tabs'
      },{
        title: '手风琴',
        path: '/accordion'
      },{
        title: '提示工具',
        path: '/tooltip'
      }]
    }
  },
  beforeCreate () {
    for (let i = 0, len = this.navs.length, item; i < len; i++) {
      this.navs[i] = avalon.mix({}, navDefault, this.navs[i])
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
