var template =
`
<div class="tabs">
  <div class="tab-header">
    <ul class="nav nav-tabs">
      <li :for="(i, tab) in tabs"
          :class="[i == index ? active : '']"
          :mouseenter="toggleHover(i, tab, true)"
          :mouseleave="toggleHover(i, tab, false)"
          :click="toggleClick(i, tab)"
          :html="tab.title">
      </li>
    </ul>
  </div>
  <div class="tab-content">
    <div class="tab-pane fade" 
         :for="(i, tab) in tabs"
         :class="[i == index ? active + ' in' : '']"
         :html="tab.content"></div>
  </div>
</div>
`

let tabsDefault = {
  title: '',
  content: ''
}

export default {
  name: 'ms-tabs',
  template,
  data () {
    return {
      $timer: 0
    }
  },
  props: {
    tabs: [],
    index: 0,
    trigger: 'click',
    delay: 300,
    active: 'active'
  },
  beforeCreate () {
    for (let i = 0, len = this.tabs.length; i < len; i++) {
      this.tabs[i] = avalon.mix({}, tabsDefault, this.tabs[i])
    }
  },
  methods: {
    onReady () {},
    toggleHover (index, tab, isEnter) {
      if (this.index == index) return
      if (this.trigger == 'hover') {
        clearTimeout(this.$timer)
        if (isEnter) {
          this.$timer = setTimeout(()=>{
            this._doSwitch(index, tab)
          }, this.delay)
        }
      }
    },
    toggleClick (index, tab) {
      if (this.index == index) return
      if (this.trigger == 'click') {
        this._doSwitch(index, tab)
      }
    },
    _doSwitch (index, tab) {
      let oldIndex = this.index
      if (this.beforeSwitch && this.beforeSwitch(index, oldIndex) === false){
        return
      }
      this.index = index
      this.afterSwitch && this.afterSwitch(index, oldIndex, tab.$model)
    }
  },
  events: ['beforeSwitch', 'afterSwitch']// 组件对外分发事件的声明,让用户重写
}
