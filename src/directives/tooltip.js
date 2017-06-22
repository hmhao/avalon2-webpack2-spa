let tooltipTemplate = 
`
<div class="tooltip">
  <div class="tooltip-arrow"></div>
  <div class="tooltip-inner"></div>
</div>
`

let popoverTemplate = 
`
<div class="popover">
  <div class="arrow"></div>
  <h3 class="popover-title"></h3>
  <div class="popover-content"></div>
</div>
`

let tooltipDefault = {
  title: '',
  trigger: 'hover', // hover | focus | click
  placement: 'right',
  content: ''
}

let utilListener = {
  _queue: {},
  length: 0,
  add (action) {
    this._queue[action.uuid] = action
    this.length++
  },
  remove (action) {
    delete this._queue[action.uuid]
    this.length--
  },
  resizeHandler (evt) {
    avalon.each(utilListener._queue, (k, action) => {
      let target = action.node.dom
      target.tooltip && action.updatePosition(target, target.tooltip, action.value.placement)
    })
  }
}

export default {
  name: 'tooltip',
  priority: 5,
  init () {
    let dom = this.node.dom
    let msDom = avalon(dom)
    let data = avalon.mix({}, tooltipDefault, this.getValue())
    this.eventType = data.trigger == 'focus' ? 'focus blur' : data.trigger == 'hover' ? 'mouseenter mouseleave' : 'click'
    this._onEventHandler = this.onEventHandler.bind(this)
    avalon.each(this.eventType.split(' '), (i, type) => {
      msDom.bind(type, this._onEventHandler)
    })
    if (!utilListener.length) {
      avalon.bind(window, 'resize', utilListener.resizeHandler)
    }
    utilListener.add(this)
  },
  beforeDispose () {
    let dom = this.node.dom
    let msDom = avalon(dom)
    avalon.each(this.eventType.split(' '), (i, type) => {
      msDom.unbind(type, this._onEventHandler)
    })
    utilListener.remove(this)
    if (!utilListener.length) {
      avalon.unbind(window, 'resize', utilListener.resizeHandler)
    }
  },
  getPosition (elem) {
    return avalon.mix({}, (typeof elem.getBoundingClientRect == 'function') ? elem.getBoundingClientRect() : {
        width: elem.offsetWidth
      , height: elem.offsetHeight
    }, avalon(elem).offset())
  },
  updatePosition (target, tooltip, placement) {
    let $tooltip = avalon(tooltip)
                    .removeClass('fade in top bottom left right')
                    .addClass(placement)
                    .css('display','block')
    let pos = this.getPosition(target)
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
    $tooltip.css(tp).addClass('fade in')
  },
  onEventHandler (evt) {
    let target = evt.currentTarget
    let parent = target.parentNode
    let evtType = evt.type
    if (evtType == 'click') {
      evtType = this.show ? 'click0' : 'click1'
    }
    switch (evtType) {
      case 'mouseenter': 
      case 'focus': 
      case 'click1': 
        let data = this.value
        let title = data.title
        let content = data.content
        let placement = data.placement
        let template = content ? popoverTemplate : tooltipTemplate
        let tooltip
        if (!target.tooltip) {
          let vnode = avalon.lexer(template)
          parent.appendChild(avalon.vdom(vnode, 'toDOM'))
          tooltip = parent.lastChild
          target.tooltip = tooltip
        } else {
          tooltip = target.tooltip
          parent.appendChild(tooltip)
        }
        if (content) {
          avalon.innerHTML(tooltip.childNodes[1], title)
          avalon.innerHTML(tooltip.lastChild, content)
        } else {
          avalon.innerHTML(tooltip.lastChild, title)
        }
        this.updatePosition(target, tooltip, placement)
        this.show = true
        break;
      case 'mouseleave':
      case 'blur': 
      case 'click0': 
        avalon.contains(parent, target.tooltip) && parent.removeChild(target.tooltip)
        this.show = false
        break;
    }
  }
}
