var template =
`
<div class="alert fade" :class="[type ? 'alert-' + type : '', global ? 'alert-fixed' : '']" :visible="visible">
  <button type="button" class="close" :visible="!autoClose" :click="close">&times;</button>
  <div class="alert-body" :html="text"></div>
</div>
`

export default {
  name: 'ms-alert',
  template,
  data () {
    return {
      visible: false,
      $timer: 0,
      $tmp: {}
    }
  },
  props: {
    text: '',
    type: 'info',
    autoClose: true,
    delay: 1000,
    global: false
  },
  afterCreate () {
    if (this.global) {
      avalon.alert = this.alert
    }
  },
  methods: {
    alert (data) {
      this.reset()
      this.text = data.text
      let $tmp = this.$tmp
      if (data.type) {
        $tmp.type = this.type
        this.type = data.type
      }
      if (avalon.type(data.autoClose) != 'undefined') {
        $tmp.autoClose = this.autoClose
        this.autoClose = !!data.autoClose
      }
      if (data.delay) {
        $tmp.delay = this.delay
        this.delay = data.delay || 1000
      }
      this.show()
    },
    reset () {
      let $tmp = this.$tmp
      if ($tmp.type) {
        this.type = $tmp.type
        $tmp.type = ''
      }
      if ($tmp.autoClose) {
        this.autoClose = $tmp.autoClose
        $tmp.autoClose = ''
      }
      if ($tmp.delay) {
        this.delay = $tmp.delay
        $tmp.delay = ''
      }
    },
    show () {
      clearTimeout(this.$timer)
      if(this.autoClose){
        this.$timer = setTimeout(() => {
          this.hide()
        }, this.delay)
      }
      this.visible = true
      avalon(this.$element).addClass('in')
    },
    hide () {
      if (!this.visible) {
        return
      }
      clearTimeout(this.$timer)
      avalon(this.$element).removeClass('in')
      this.visible = false
      this.reset()
    },
    close (evt) {
      this.hide()
    }
  }
}
