var template =
`
<div class="modal hide fade" :visible="visible">
  <div class="modal-header">
    <button type="button" class="close" :click="close">&times;</button>
    <slot name="modal-title"></slot>
  </div>
  <div class="modal-body">
    <slot name="modal-body"></slot>
  </div>
  <div class="modal-footer">
    <button type="button" class="btn btn-default" :click="close" :if="closeText">{{closeText}}</button>
    <button type="button" class="btn btn-primary" :click="confirm">{{confirmText}}</button>
  </div>
</div>
`

let backdrop = avalon(document.createElement('div')).addClass('modal-backdrop fade')

export default {
  name: 'ms-modal',
  template,
  data () {
    return {
      visible: false,
      $backdrop: backdrop
    }
  },
  props: {
    confirmText: '确定',
    closeText: '取消'
  },
  methods: {
    show () {
      if (this.visible) {
        return
      }
      this.visible = true
      this.$backdrop.addClass('in')
      document.body.appendChild(this.$backdrop.element)
      if (avalon.msie < 8) {
        document.body.appendChild(this.$element)
      }
      avalon(this.$element).addClass('in')
    },
    hide () {
      if (!this.visible) {
        return
      }
      document.body.removeChild(this.$backdrop.element)
      avalon(this.$element).removeClass('in')
      this.$backdrop.removeClass('in')
      this.visible = false
    },
    confirm (evt) {
      if (this.onConfirm && this.onConfirm(evt) === false) {
        // Cancel event
        return
      }
      this.hide()
    },
    close (evt) {
      this.onClose && this.onClose(evt)
      this.hide()
    }
  },
  events: ['onConfirm', 'onClose']// 组件对外分发事件的声明,让用户重写
}
