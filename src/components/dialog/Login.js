import Modal from '@/components/base/Modal'

var template =
`
<ms-modal id="loginModal" :ref="modal" :validate="validate">
  <div slot="modal-title">登录框</div>
  <form class="form-horizontal" slot="modal-body">
    <div class="control-group">
      <label class="control-label" for="username">用户名</label>
      <div class="controls">
        <input type="text" class="form-control" id="username" placeholder="用户名" :duplex="username" :rules="{required:true, maxlength:24}" data-required-message="用户名必须填写" data-maxlength-message="用户名超过24字">
        <span class="help-inline"></span>
      </div>
    </div>
    <div class="control-group">
      <label class="control-label" for="password">密码</label>
      <div class="controls">
        <input type="password" class="form-control" id="password" placeholder="密码" :duplex="password" :rules="{required:true}" data-required-message="密码必须填写">
        <span class="help-inline"></span>
      </div>
    </div>
    <div class="control-group">
      <div class="controls">
        <label class="checkbox">
          <input type="checkbox" :duplex-checked="autoLogin" :rules="{norequired:true}"> 自动登录
        </label>
      </div>
    </div>
  </form>
  <div slot="modal-footer" class="text-center">
    <button type="submit" class="btn btn-default" :click="onSubmit">登录</button>
  </div>
</ms-modal>
`

let validate = {//表单校验
  validateInBlur: false,
  onManual: avalon.noop,//占位,IE6-8必须指定,avalon会重写这方法
  onSuccess (reasons) {
    reasons.forEach(function (reason) {
      let elem = avalon(reason.element)
      let sibling = elem.sibling('.help-inline')
      avalon.innerHTML(sibling.element, '')
      let parent = elem.parent('.control-group')
      parent.removeClass('error')
    })
  },
  onError (reasons) {
    reasons.forEach(function (reason) {
      let elem = avalon(reason.element)
      let sibling = elem.sibling('.help-inline')
      avalon.innerHTML(sibling.element, reason.getMessage())
      let parent = elem.parent('.control-group')
      parent.addClass('error')
    })
  },
  onValidateAll (reasons) {
    let vm = this._ms_validate_.vm
    if (reasons.length) {
      this._ms_validate_.onError(reasons)
    } else {
      avalon.log('全部通过')
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
    ...avalon.store.mapActions(['login', 'logout']),
    init (isLogin) {
      if (!isLogin) {
        this.$$ref.modal.show()
      } else {
        this.logout()
      }
    },
    submit () {
      this.login({
        userid: '123456',
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
  components: {
    Modal
  }
}
