var template =
`
<div :class="[type, open && 'open', reverse && 'dropup']" 
     :mouseenter="toggle($event, true)" 
     :mouseleave="toggle($event, false)" 
     :click="toggle($event)">
  <a class="dropdown-toggle btn" href="javascript:void(0)">
    {{text}}
    <span class="caret"></span>
  </a>
  <ul class="dropdown-menu">
    <li :for="l in list" :class="{divider: !l}">
      <a tabindex="-1" :if="!!l" 
        :attr="{href: l.href ? l.href : 'javascript:void(0)'}" 
        :click="l.cb ? l.cb($event) : avalon.noop($event)">
        {{l.text}}
      </a>
    </li>
  </ul>
</div>
`

let toggleDelay = 200
let toggleTimer

let dropdownDefault = {
  text: '',
  href: '',
  cb: avalon.noop
}

export default {
  name: 'ms-dropdown',
  template,
  data () {
    return {
      open: false,
      $docClickCb: avalon.noop
    }
  },
  props: {
    type: 'dropdown',//dropdown | btn-group
    trigger: 'click',//click | hover
    text: '',
    reverse: false,
    list: []
  },
  beforeCreate () {
    for (let i = 0, len = this.list.length, item; i < len; i++) {
      item = this.list[i]
      if (item) {
        if (typeof item === 'string') {
          item = {text: item}
        }
        this.list[i] = avalon.mix({}, dropdownDefault, item)
      }
    }
  },
  methods: {
    onReady () {
    },
    toggle (evt, hover) {
      let type = evt.type
      if (this.trigger == 'click' && type == 'click') {
        return this.toggleClick(evt)
      } else if (this.trigger == 'hover') {
        return this.toggleHover(evt, !!hover)
      }
    },
    toggleClick (evt) {
      let $target = avalon(evt.target)
      if ($target.is('.dropdown-toggle') || $target.parent('.dropdown-toggle')[0]) {
        if (!this.open) {
          this.open = true
          this.onOpen && this.onOpen()
          setTimeout(()=>{
            this.$docClickCb = avalon.bind(document, 'click', this.toggleClick)
          })
        }
      } else {
        this.open = false
        setTimeout(()=>{
          avalon.unbind(document, 'click', this.$docClickCb)
        })
        return false
      }
    },
    toggleHover (evt, hover) {
      clearTimeout(toggleTimer)
      toggleTimer = setTimeout(()=>{
        this.open = hover
        if (hover) {
          this.onOpen && this.onOpen()
        } else {
          this.onClose && this.onClose()
        }
      }, toggleDelay)
    }
  },
  events: ['onOpen', 'onClose']// 组件对外分发事件的声明,让用户重写
}
