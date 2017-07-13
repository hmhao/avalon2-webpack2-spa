import Datepicker from '@/components/base/Datepicker'

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
  clickHandler (evt) {
    avalon.each(utilListener._queue, (k, action) => {
      let vm = action.datepickerVM
      let $datepicker = action.$datepicker
      if (vm && $datepicker && $datepicker.style.display != '') {
        let parent = avalon(evt.target).parent('.datepicker')
        if (!parent.element) {
          vm.visibleYearMonth = false
          $datepicker.style.display = ''
        }
      }
    })
  },
  resizeHandler (evt) {
    avalon.each(utilListener._queue, (k, action) => {
      action.updatePosition(action.$input, action.$datepicker, action.value.placement)
    })
  }
}

let directiveDefault = {
  placement: 'bottom',
  format: 'yyyy-MM-dd HH:mm:ss',
  $date: '',
  $directive: true,
  $timesActive: true
}

let register = false

export default {
  name: 'datepicker',
  priority: 5,
  beforeInit () {
    if (!register) {
      avalon.registerComponent(Datepicker)
      register = true
    }
    this.$input = ''
    this.$datepicker = ''
  },
  init () {
    let input = this.$input = this.node.dom
    if (input.nodeName != 'INPUT' && input.type != 'text') {
      return avalon.error('指令元素必须是type为text的input')
    }
    
    this._onEventHandler = this.onEventHandler.bind(this)
    avalon.bind(input, 'click', this._onEventHandler)
    if (!utilListener.length) {
      avalon.bind(document, 'click', utilListener.clickHandler)
      avalon.bind(window, 'resize', utilListener.resizeHandler)
    }
    utilListener.add(this)
  },
  update () {
    this.$input.value = this.value.$date || ''
  },
  beforeDispose () {
    let input = this.node.dom
    avalon.unbind(input, 'click', this._onEventHandler)
    utilListener.remove(this)
    if (!utilListener.length) {
      avalon.unbind(document, 'click', utilListener.clickHandler)
      avalon.unbind(window, 'resize', utilListener.resizeHandler)
    }
    this.datepickerVM && this.fireHook(this.datepickerVM, this.node, 'Dispose')
  },
  fireHook(vm, vdom, name) {
    let event = 'on' + name
    if (vm[event]) {
      vm[event].call(vm, {
        type: name.toLowerCase(),
        target: vdom.dom,
        vmodel: vm
      })
    }
  },
  getPosition (elem) {
    return avalon.mix({}, (typeof elem.getBoundingClientRect == 'function') ? elem.getBoundingClientRect() : {
        width: elem.offsetWidth
      , height: elem.offsetHeight
    }, avalon(elem).offset())
  },
  updatePosition (target, datepicker, placement) {
    let pos = this.getPosition(target)
    let actualHeight = datepicker.offsetHeight,
        tp
    switch (placement) {
      case 'top':
        tp = {top: pos.top - actualHeight - 5, left: pos.left}
        break
      default:
        tp = {top: pos.top + pos.height, left: pos.left}
        break
    }
    avalon(datepicker).css(tp)
  },
  onEventHandler (evt) {
    let datepickerVM = this.datepickerVM
    if (!datepickerVM) {
      let data = this.value
      let definition = avalon.mix({}, Datepicker.defaults, directiveDefault, {
        $id: avalon.makeHashCode('datepicker'),
        onChoose: this.onChoose.bind(this),
        onClear: this.onClear.bind(this),
        onCancel: this.onCancel.bind(this)
      }, data)
      datepickerVM = this.datepickerVM = avalon.define(definition)
      this.fireHook(datepickerVM, this.node, 'Init')
      
      this.$input.lastValue = definition.$date

      let render = datepickerVM.$render = avalon.scan(Datepicker.template, datepickerVM)
      this.$datepicker = render.root.dom;
      (this.$input.parentNode || document.body).appendChild(this.$datepicker)
      this.fireHook(datepickerVM, this.node, 'Ready')
      
      this.$datepicker.style.display = 'block'//初始化需要先设置可见，然后计算位置才准确
      this.updatePosition(this.$input, this.$datepicker, definition.placement)
    } else {
      if (!this.$input.value) {
        datepickerVM.setValue(datepickerVM.$date = new Date())
      }
      this.$input.lastValue = this.$input.value
      this.$datepicker.style.display = 'block'
    }
    evt.stopPropagation()
  },
  onChoose (value, date) {
    this.$input.value = value
  },
  onClear () {
    this.$input.value = ''
  },
  onCancel () {
    this.datepickerVM.visibleYearMonth = false
    this.$datepicker.style.display = ''
    this.$input.value = this.$input.lastValue
    this.datepickerVM.setValue(this.datepickerVM.$date = new Date(this.$input.lastValue.replace(/-/g,'/')))
  }
}
