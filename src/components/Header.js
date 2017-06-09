import Login from '@/components/dialog/Login'

let template = 
`
<div class="navbar">
  <div class="navbar-inner">
    <a class="brand" href="javascript:void(0)">
      <img :if="logo" :attr="{src:logo}" />
      <span :if="!logo" :text="title"></span>
    </a>
    <ul class="nav">
      <li :for="n in navs" :class="{active: n.active}"><a :attr="{href: '#!' + n.path}">{{n.title}}</a></li>
    </ul>
    <form class="navbar-search pull-left">
      <input type="text" class="search-query" placeholder="Search">
    </form>
    <ul class="nav pull-right">
      <li class="dropdown" :class="{open:showUserbox}" :mouseenter="toggleUserbox(true)" :mouseleave="toggleUserbox(false)" :visible="isLogin">
        <a href="javascript:void(0)" class="dropdown-toggle"><i class="fa fa-user"></i>{{user.nick}} <b class="caret"></b></a>
        <ul class="dropdown-menu">
          <li><a href="javascript:void(0)">Action</a></li>
          <li><a href="javascript:void(0)">Another action</a></li>
          <li><a href="javascript:void(0)">Something else here</a></li>
          <li class="divider"></li>
          <li><a href="javascript:void(0)">Separated link</a></li>
        </ul>
      </li>
      <li class="divider-vertical"></li>
      <li><button class="btn btn-primary" :text="loginText" :click="toggleLogin"></button></li>
    </ul>
  </div>
  <ms-login :ref="login" />
</div>
`
let toggleDelay = 200
let toggleTimer

export default {
  name: 'ms-header',
  template,
  data () {
    return {
      title: 'SPA',
      logo: '',
      showUserbox: false,
      navs: [{
        title: '首页',
        path: '/index',
        active:false
      }]
    }
  },
  computed: {
    ...avalon.store.mapState(['isLogin', 'user']),
    loginText () {
      return this.isLogin ? '退出' : '登录'
    }
  },
  methods: {
    onReady () {
      avalon.store.dispatch('autoLogin')
      let router = avalon.router.vm
      this.update(router.route)
      router.$watch('route', this.update)
    },
    update (route){
      let path = route.path
      avalon.each(this.navs, (i, nav)=>{
        nav.active = path === nav.path
      })
    },
    toggleLogin () {
      this.$$ref.login.init(this.isLogin)
    },
    toggleUserbox (isEnter) {
      clearTimeout(toggleTimer)
      toggleTimer = setTimeout(()=>this.showUserbox = isEnter, toggleDelay)
    }
  },
  components: {
    Login
  }
}
