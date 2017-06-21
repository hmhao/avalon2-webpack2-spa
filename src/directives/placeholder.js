let template = 
`
<span class="wrap-placeholder" style="position:absolute; color:#ACA899; display:inline-block; overflow:hidden;">
</span>
`
//判断浏览器是否支持placeholder属性
let supportPlaceholder = 'placeholder'in document.createElement('input')

export default {
  name: 'placeholder',
  priority: 5,
  init () {
    let target = this.node.dom
    let targetNodeName = target.nodeName
    if (targetNodeName != 'INPUT' && targetNodeName != 'TEXTAREA') {
      return avalon.error('placeholder指令只适用于input或textarea')
    }

    let props = this.node.props
    delete props['ms-placeholder']
    delete props[':placeholder']

    let defaultValue = this.getValue() || this.expr
    target.setAttribute('placeholder', defaultValue)
    if (!supportPlaceholder) {
      setTimeout(()=>{
        let parent = target.parentNode
        let vnode = avalon.lexer(template)
        let wrapper = avalon.vdom(vnode, 'toDOM')
        parent.insertBefore(wrapper, target)
        wrapper = parent.firstChild
        let $target = avalon(target),
            $wrapper = avalon(wrapper),
            offsetWidth = target.offsetWidth,
            offsetHeight = target.offsetHeight,
            marginLeft = parseInt($target.css('marginLeft')),
            marginTop = parseInt($target.css('marginTop')),
            paddingLeft = parseInt($target.css('paddingLeft'));
        let style = {
          fontFamily: $target.css('fontFamily'),
          fontSize: $target.css('fontSize'),
          marginLeft: marginLeft ? marginLeft + 3 : 3,
          marginTop: marginTop ? marginTop : 1,
          paddingLeft: paddingLeft,
          width: offsetWidth - marginLeft - paddingLeft,
          height: offsetHeight,
          lineHeight: targetNodeName == 'TEXTAREA' ? $target.css('lineWeight') : offsetHeight + 'px'
        }
        $wrapper.css(style)
        avalon.innerHTML(wrapper, defaultValue)
        this.target = target
        this.wrapper = wrapper

        wrapper.onclick = function () {
          target.focus()
        }
        //绑定input或onpropertychange事件
        this._changeHandler = this.changeHandler.bind(this)
        avalon.bind(target, 'input', this._changeHandler)

        if (avalon.msie == 9) {
          this._focusHandler = this.focusHandler.bind(this)
          avalon.bind(target, 'focus', this._focusHandler)
          avalon.bind(target, 'blur', this._focusHandler)
        }
      }, 100)
    }
  },
  changeHandler () {
    let $wrapper = avalon(this.wrapper)
    $wrapper.css('display', this.target.value != '' ? 'none': 'inline-block')
  },
  focusHandler (evt) {
    if (evt.type === 'focus') {
      document.addEventListener('selectionchange', this._changeHandler, false)
    } else {
      document.removeEventListener('selectionchange', this._changeHandler, false)
    }
  },
  beforeDispose () {
    let target = this.node.dom
    avalon.unbind(target, 'input', this._changeHandler)
    if (this.wrapper) {
      this.wrapper.onclick = null
    }
    if (avalon.msie == 9) {
      avalon.unbind(target, 'focus', this._onFocusChange)
      avalon.unbind(target, 'blur', this._onFocusChange)
      delete this._onFocusChange
      document.removeEventListener('selectionchange', this._changeHandler)
    }
  }
}
