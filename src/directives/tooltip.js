let template = 
`
  <div class="tooltip">
    <div class="tooltip-arrow"></div>
    <div class="tooltip-inner"></div>
  </div>
`

function getPosition(elem) {
  return avalon.mix({}, (typeof elem.getBoundingClientRect == 'function') ? elem.getBoundingClientRect() : {
      width: elem.offsetWidth
    , height: elem.offsetHeight
  }, avalon(elem).offset())
}

function onEventHandler (evt) {
  let target = evt.currentTarget
  let parent = target.parentNode
  switch (evt.type) {
    case 'mouseenter': 
    case 'focus': 
      let title = this.value.title
      let placement = this.value.placement
      let tooltip
      if (!parent.tooltip) {
        let vnode = avalon.lexer(template)
        parent.appendChild(avalon.vdom(vnode, 'toDOM'))
        tooltip = parent.lastChild
        parent.tooltip = tooltip
      } else {
        tooltip = parent.tooltip
        parent.appendChild(tooltip)
      }
      avalon.innerHTML(tooltip.lastChild, title)

      let $tooltip = avalon(tooltip).removeClass('fade in top bottom left right').addClass(placement)
      let pos = getPosition(target)
      let actualWidth = tooltip.offsetWidth,
          actualHeight = tooltip.offsetHeight,
          tp
      switch (placement) {
        case 'bottom':
          tp = {top: pos.top + pos.height, left: pos.left + pos.width / 2 - actualWidth / 2}
          break
        case 'top':
          tp = {top: pos.top - actualHeight, left: pos.left + pos.width / 2 - actualWidth / 2}
          break
        case 'left':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left - actualWidth}
          break
        case 'right':
          tp = {top: pos.top + pos.height / 2 - actualHeight / 2, left: pos.left + pos.width}
          break
      }
      tp.display = 'block'
      $tooltip.css(tp).addClass('fade in')
      break;
    case 'mouseleave':
    case 'blur': 
      parent.removeChild(parent.tooltip)
      break;
  }
}
let rtrigger = /trigger\s*:\s*['"]([^'"]+)['"]/

export default {
  name: 'tooltip',
  priority: 5,
  init () {
    let dom = this.node.dom
    let msDom = avalon(dom)
    let match = rtrigger.exec(this.expr)
    this.eventType = match && match[1] == 'focus' ? 'focus blur' : 'mouseenter mouseleave'
    this._onEventHandler = onEventHandler.bind(this)
    avalon.each(this.eventType.split(' '), (i, type) => {
      msDom.bind(type, this._onEventHandler)
    })
  },
  beforeDispose () {
    let dom = this.node.dom
    let msDom = avalon(dom)
    avalon.each(this.eventType.split(' '), (i, type) => {
      msDom.unbind(type, this._onEventHandler)
    })
  }
}
