var template =
`
<div class="accordion">
  <div class="accordion-group" :for="(i, item) in accordion">
    <div class="accordion-heading">
      <div class="accordion-toggle" :html="item.title" :click="toggle(item)"></div>
    </div>
    <div class="accordion-body collapse" :class="[item.active ? 'in' : '']">
      <div class="accordion-inner" :html="item.content"></div>
    </div>
  </div>
</div>
`

let accordionDefault = {
  title: '',
  content: '',
  active: false
}

export default {
  name: 'ms-accordion',
  template,
  data () {
    return {
    }
  },
  props: {
    accordion: [],
    multiple: false
  },
  beforeCreate () {
    let active = 0
    for (let i = 0, len = this.accordion.length; i < len; i++) {
      this.accordion[i] = avalon.mix({}, accordionDefault, this.accordion[i])
      this.accordion[i].active && active++
    }
    this.multiple = this.multiple || active > 1
  },
  methods: {
    toggle (item) {
      if (item.active) {
        item.active = false
        this.onCollapse && this.onCollapse(item.$model)
      } else {
        if (!this.multiple) {
          avalon.each(this.accordion, (i, _item) => {
            if (_item.active) {
              _item.active = false
              this.onCollapse && this.onCollapse(_item.$model)
            }
          })
        }
        item.active = true
        this.onExpand && this.onExpand(item.$model)
      }
    }
  },
  events: ['onExpand', 'onCollapse']// 组件对外分发事件的声明,让用户重写
}
