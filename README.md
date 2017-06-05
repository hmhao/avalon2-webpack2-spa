# avalon2-webpack2-spa

## 说明
* 整合avalon2和webpack2，支持webpack热更新
* 兼容性支持IE8以下，IE8以下禁用热更新，需要手动刷新
* [采用ES6、类vue的单文件组件书写](#component)
（avalon组件只使用defaults来定义组件VM的属性与方法，在书写时非常混乱）
* 父组件可通过$$ref引用子组件，但需要显式声明
* 加入官网路由并改造
* 加入es6-promise、cookie_js、[avalonx](https://github.com/hmhao/avalonx)
* 提供基于Bootstrap2的基础组件Alert、Dropdown、Modal、Pagination、Panel（后续待补充其他）

<span id="component"></span>
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
<ms-modal id="loginModal" :widget="[$$ref.modal]" :validate="validate">
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
    onClose () {
      
    }
  },
  components: [{
    component: Modal,
    $$ref: 'modal',// 模板书写组件:widget的值必须与ref一致,当前组件可通过ref对应的值获取到子组件的vmodel
    events: ['onConfirm', 'onClose']// 对依赖的组件关联事件,依赖组件分发事件时会自动调用
  }]
}

```
上面书写完成例子参考：[Login](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/dialog/Login.js)


## 使用
| 命令             | 说明                         |
| ---------------- | ---------------------------- |
| npm run dev      | 开发模式运行项目（带热更新） |
| npm run build    | 构建生产环境代码             |
