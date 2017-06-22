let template =
`
<input type="text" autocomplete="off" data-provide="typeahead" :duplex="value" data-duplex-changed="search" :focus="toggleInput($event, true)" :blur="toggleInput($event, false)" />
`

let itemTemplate =
`
<ul class="typeahead dropdown-menu">
  <li :for="item in items">
    <a href="javascript:void(0)" :html="item | highlighter(value)" :click="select(item)"></a>
  </li>
</ul>
`

export default {
  name: 'ms-typeahead',
  template,
  data () {
    return {
      open: false,
      value: '',
      items: [],
      $search: {
        debounce: null,//输入去抖
        blur: null,//失焦去抖
        delay: 300
      }
    }
  },
  props: {
    $source: [], //数据源
    itemLength: 4, //下拉菜单中显示的最大的条目数
    minLength: 1, //触发提示所需的最小字符个数
  },
  beforeCreate () {
  },
  methods: {
    onReady () {
      let render = avalon.scan(itemTemplate, this)
      let typeahead = render.root.dom
      let container = this.$element.parentNode
      container.appendChild(typeahead)
    },
    toggleInput (evt, isFocus) {
      if (!isFocus) {
        clearTimeout(this.$search.blur)
        this.$search.blur = setTimeout(()=>{
          this.open = false
        }, this.$search.delay)
      }
    },
    search () {
      clearTimeout(this.$search.debounce)

      let value = this.value
      if (!value) return this.open = false

      this.$search.debounce = setTimeout(()=>{
        if (value.length < this.minLength) return
        if (avalon.isFunction(this.$source)) {
          this.$source(value, (items) => this.searchCb(items))
        } else {
          let items = []
          avalon.each(this.$source, (i, item)=>{
            if (~item.toLowerCase().indexOf(value.toLowerCase())) {
              items.push(item)
            }
          })
          this.searchCb(items)
        }
      }, this.$search.delay)
    },
    searchCb (items) {
      if (items.length) {
        items = this.sorter(items)
        this.items = items.slice(0, this.itemLength)
        this.open = true
      } else {
        this.open = false
      }
    },
    select (item) {
      this.value = item
      this.onSelect && this.onSelect(item)
      this.open = false
    },
    sorter (items) {
      let value = this.value,
          beginswith = [],
          caseSensitive = [],
          caseInsensitive = [],
          item

      while (item = items.shift()) {
        if (!item.toLowerCase().indexOf(value.toLowerCase())) beginswith.push(item)
        else if (~item.indexOf(value)) caseSensitive.push(item)
        else caseInsensitive.push(item)
      }

      return beginswith.concat(caseSensitive, caseInsensitive)
    }
  },
  watch: {
    open (value) {
      let $container = avalon(this.$element.parentNode)
      $container[(value ? 'add' : 'remove') + 'Class']('open')
    }
  },
  filters: {
    highlighter (item, value) {
      value = value.replace(/[\-\[\]{}()*+?.,\\\^$|#\s]/g, '\\$&')
      return item.replace(new RegExp('(' + value + ')', 'ig'), function ($1, match) {
        return '<strong>' + match + '</strong>'
      })
    }
  },
  events: ['onSelect']// 组件对外分发事件的声明,让用户重写
}
