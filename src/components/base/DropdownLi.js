var template =
`
<li class="dropdown" :class="[open && 'open']" 
     :mouseenter="toggle($event, true)" 
     :mouseleave="toggle($event, false)" 
     :click="toggle($event)">
  <a class="dropdown-toggle" href="javascript:void(0)">
    {{text}}
    <span class="caret"></span>
  </a>
  <ul class="dropdown-menu">
    <li :for="l in list" :class="{divider: !l}">
      <a tabindex="-1" :if="!!l" 
        :attr="{href: l.href ? l.href : 'javascript:void(0)'}" 
        :click="l.cb ? l.cb($event) : avalon.noop($event)">
        {{l && l.text ? l.text : l}}
      </a>
    </li>
  </ul>
</li>
`

let toggleDelay = 200
let toggleTimer

export default {
  name: 'ms-dropdown-li',
  template,
  data () {
    return {
      open: false,
      docClickCb: avalon.noop
    }
  },
  props: {
    trigger: 'click',//click | hover
    text: '',
    list: []
    /*
      String
      
      or

      Object {
        text: String,
        href: String,
        cb: Function
      }
    */
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
            this.docClickCb = avalon.bind(document, 'click', this.toggleClick)
          })
        }
      } else {
        this.open = false
        setTimeout(()=>{
          avalon.unbind(document, 'click', this.docClickCb)
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
