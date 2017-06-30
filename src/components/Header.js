import Typeahead from '@/components/base/typeahead'
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
      <ms-router-link :for="nav in navs" :widget="[{to: nav.path, text: nav.title, tag: 'li'}]" />
    </ul>
    <form class="navbar-search pull-left">
      <ms-typeahead :class="'search-query'" :placeholder="'placeholder指令和Typeahead组件'" :widget="[$typeahead]"/>
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
        path: '/index'
      }],
      $typeahead: {
        $source: ['Alabama','Alaska','Arizona','Arkansas','California','Colorado','Connecticut','Delaware','Florida','Georgia','Hawaii','Idaho','Illinois','Indiana','Iowa','Kansas','Kentucky','Louisiana','Maine','Maryland','Massachusetts','Michigan','Minnesota','Mississippi','Missouri','Montana','Nebraska','Nevada','New Hampshire','New Jersey','New Mexico','New York','North Dakota','North Carolina','Ohio','Oklahoma','Oregon','Pennsylvania','Rhode Island','South Carolina','South Dakota','Tennessee','Texas','Utah','Vermont','Virginia','Washington','West Virginia','Wisconsin','Wyoming'],
        itemLength: 5
      }
    }
  },
  computed: {
    ...avalon.store.mapState(['isLogin', 'user']),
    loginText () {
      return this.isLogin ? '退出' : '模态框-登录'
    }
  },
  methods: {
    onReady () {
      avalon.store.dispatch('autoLogin')
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
    Typeahead,
    Login
  }
}
