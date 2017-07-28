# avalon2-webpack2-spa
>该项目不直接修改avalon2源码，只是在其基础上扩展。[演示地址](https://hmhao.github.io/avalon2-webpack2-spa/)

## 说明
* 整合avalon2和webpack2，支持webpack热更新
* 兼容性支持IE8以下，IE8以下禁用热更新，需要手动刷新
* [采用ES6、类vue的单文件组件书写](#component)
（avalon组件只使用defaults来定义组件VM的属性与方法，在书写时非常混乱）
* 加入官网路由并改造，实现嵌套路由(使用[ms-router-link](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/link.js)和[ms-router-view](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/view.js))，支持路由懒加载([参考](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/index.js))
* 加入cookie_js、[avalonx](https://github.com/hmhao/avalonx)(状态管理)
* 增加ref指令，父组件可通过$$ref引用子组件
* 提供组件指令placeholder、tooltip、datepicker
* 提供基于Bootstrap2的基础组件Accordion、Alert、Datepicker、Dropdown、Grid、Modal、Pagination、Panel、Tabs、Tree、Typeahead（后续待补充其他）

## 路由书写
```
export default new Router({
  routes: [{
    path: ['/', '/#'],
    redirect: '//index' //必须使用双斜杠,mmRouter的urlFormate过滤掉第一个斜杠
  }, {
    path: '/index',
    title: '首页',
    component: IndexPanel
  }, {
    path: '/router',
    title: '嵌套路由',
    component: RouterPanel,
    children: [{ 
      path: 'foo', 
      component: Foo 
    }, { 
      path: 'bar', 
      component: Bar,  
      children: [{ 
          path: 'baz', 
          component: Baz 
      }]
    }]
  }]
})
```
上面书写完成例子参考：[router](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/index.js)

## 路由使用
```
<ul>
  <li><ms-router-link :widget="[{to: '/router', text: '/'}]" /></li>
  <li><ms-router-link :widget="[{to: '/router/foo', text: '/foo'}]" /></li>
</ul>

<ul>
  <ms-router-link :for="nav in navs" :widget="[{to: nav.path, text: nav.title, activeClass: 'active', tag: 'li'}]" />
</ul>

<ms-router-view />
```
上面书写完成例子参考：[Nav](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/Nav.js)

## 组件书写
现支持
* data：组件内部属性
* props：来自父组件的数据
* computed：组件计算属性
* methods：组件方法及钩子函数
* watch：组件内部观察属性变化
* filters：组件自定义过滤器
* events：组件对外分发事件的声明
* components：组件依赖的子组件
* beforeCreate：组件创建vm前会调用，可用于vm数据校验或补充
* afterCreate：组件创建vm后会调用

<span id="component"></span>
```
// 定义模板
var template =
`
<div class="modal hide fade" :visible="visible">
  ...
</div>
`
// 定义组件
export default {
  name: 'ms-modal',
  template,
  data () {
    return {
      visible: false
    }
  },
  props: {
    confirmText: '确定',
    closeText: '取消'
  },
  computed: {},
  methods: {
    onReady () {},
    onDispose () {},
    show () {},
    hide () {},
    confirm (evt) {
      if (this.onConfirm && this.onConfirm(evt) === false) {
        return
      }
      this.hide()
    },
    close (evt) {
      this.onClose && this.onClose(evt)
      this.hide()
    }
  },
  watch: {},
  filters: {},
  events: ['onConfirm', 'onClose'],// 组件对外分发事件的声明,让用户重写
  components: []
}
```
上面书写完成例子参考：[Modal](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/base/Modal.js)

## 组件使用
```
// 加入依赖的子组件
import Modal from '@/components/base/Modal'

var template =
`
<ms-modal id="loginModal" :ref="modal" :validate="validate">
  <div slot="modal-title">登录框</div>
  ...
</ms-modal>
`

// 定义表单校验
let validate = {
  validateInBlur: false,
  onManual: avalon.noop,//占位,IE6-8必须指定,avalon会重写这方法
  onSuccess (reasons) {},
  onError (reasons) {},
  onValidateAll (reasons) {
    let vm = this._ms_validate_.vm
    if (reasons.length) {
      this._ms_validate_.onError(reasons)
    } else {
      vm.submit()
    }
  }
}

export default {
  name: 'ms-login',
  template,
  data () {
    return {
      username: '',
      password: '',
      autoLogin: false,
      validate
    }
  },
  methods: {
    ...avalon.store.mapActions(['login', 'logout']),// avalonx
    init (isLogin) {
      if (!isLogin) {
        this.$$ref.modal.show()
      } else {
        this.logout()
      }
    },
    submit () {
      this.login({
        usernick: this.username,
        autoLogin: this.autoLogin
      })
      this.$$ref.modal.hide()
      this.reset()
    },
    reset () {
      this.username = ''
      this.password = ''
      this.autoLogin = false
    },
    onConfirm () {
      //由于avalon在validate中的上下文会改变,而validate没有指向当前vm的引用
      //因此需要想办法使validate可以拿到当前vm
      //validate上下文为定义validate指令的元素,可以从这个元素入手
      this.$element._ms_validate_.vm = this//将当前vm注入
      this.validate.onManual()
      return false
    },
    onClose () {}
  },
  components: {
    Modal
  }
}

```
上面书写完成例子参考：[Login](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/dialog/Login.js)


## 使用
| 命令             | 说明                         |
| ---------------- | ---------------------------- |
| npm run dev      | 开发模式运行项目（带热更新） |
| npm run build    | 构建生产环境代码             |
