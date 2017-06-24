let template =
`
<div class="carousel">
  <!-- Carousel items -->
  <div class="carousel-inner">
    <div class="item" 
         :for="(i, item) in items"
         :attr="{id: item.$id}"
         :class="{active: item.active}">
      <a :attr="{href: item.href}"><img :attr="{src: item.img}"></a>
      <div class="carousel-caption" :html="item.caption"></div>
    </div>
  </div>
  <!-- Carousel indicators -->
  <ol :class="[indicatorsClass]">
    <li :for="(i, indicator) in indicators" 
        :html="indicator.content" 
        :click="to(i)"
        :class="{active: indicator.active}">
    </li>
  </ol>
  <!-- Carousel nav -->
  <div :if="control">
    <a class="carousel-control left" href="javascript:void(0)" :click="prev">&lsaquo;</a>
    <a class="carousel-control right" href="javascript:void(0)" :click="next">&rsaquo;</a>
  </div>
</div>
`

let itemDefault = {
  img: '',
  href: 'javascript:void(0)',
  caption: '',
  active: false
}

let indicatorDefault = {
  content: '',
  active: false
}

export default {
  name: 'ms-carousel',
  template,
  data () {
    return {
      $timer: 0,//计时器
      $index: 0,//索引
      $paused: false,//已暂停
      $sliding: false//正在切换
    }
  },
  props: {
    interval: 5000,//自动轮播展示每帧所停留的时间。如果是false，轮播不会自动启动
    indicators: [],//轮播指示项
    indicatorsClass: 'carousel-indicators',//轮播指示项样式
    items: [],//轮播数据项
    control: true//是否显示控制器
  },
  beforeCreate () {
    for (let i = 0, len = this.items.length; i < len; i++) {
      this.items[i] = avalon.mix({}, itemDefault, this.items[i])
      this.indicators[i] = avalon.mix({}, indicatorDefault, {content: this.indicators[i] || ''})
    }
    this.items[0].active = true
    this.indicators[0].active = true
  },
  methods: {
    onReady () {
      avalon.each(this.items, (i, item) => {
        item.$element = document.getElementById(item.$id)
      })
      avalon.bind(this.$element, 'mouseenter', (e) => {
        this.pause(e)
      })
      avalon.bind(this.$element, 'mouseleave', (e) => {
        this.cycle(e)
      })
      if (this.interval) {
        this.pause().cycle()
      }
    },
    onDispose () {
      avalon.unbind(this.$element, 'mouseenter')
      avalon.unbind(this.$element, 'mouseleave')
    },
    fixIndex (index) {
      let len = this.items.length
      index = index % len
      if (index < 0) {
        index += len
      }
      return index
    },
    cycle (e) {
      if (!e) this.$paused = false
      if (this.interval && this.items.length > 1) {
        clearInterval(this.$timer)
        if (!this.$paused) {
          this.$timer = setInterval(() => this.next(), this.interval)
        }
      }
      return this
    },
    pause (e) {
      if (!e) this.$paused = true
      clearInterval(this.$timer)
      this.$timer = null
      return this
    },
    to (index) {
      index = this.fixIndex(index)

      if (this.$index == index) {
        return this.pause().cycle()
      }
      this.change(index > this.$index ? 'next' : 'prev', index)
    },
    next () {
      if (this.$sliding) return
      this.change('next')
    },
    prev () {
      if (this.$sliding) return
      this.change('prev')
    },
    change (type, nextIndex) {
      nextIndex = avalon.type(nextIndex) === 'undefined' ? this.fixIndex(this.$index + (type == 'next' ? 1 : -1)) : nextIndex

      let isCycling = this.$timer,
          direction = type == 'next' ? 'left' : 'right',
          activeItem = this.items[this.$index],
          nextItem = this.items[nextIndex]

      this.beforeChange(type, this.$index)
      this.$sliding = true

      isCycling && this.pause()

      avalon.each(this.indicators, (i, indicator) => {
        indicator.active = false
      })

      let $element = avalon(this.$element),
          $activeItem = avalon(activeItem.$element),
          $nextItem = avalon(nextItem.$element),
          complete = () => {
            $activeItem.removeClass(direction)
            $nextItem.removeClass([type, direction].join(' '))
            activeItem.active = false
            nextItem.active = true
            this.indicators[nextIndex].active = true
            this.$sliding = false
            this.$index = nextIndex
            this.afterChange(type, this.$index)
            isCycling && this.cycle()
          }

      if (avalon.support.transition) {
        $nextItem.addClass(type)
        $nextItem[0].offsetWidth // force reflow
        $activeItem.addClass(direction)
        $nextItem.addClass(direction)
        $nextItem.one(avalon.support.transition.end, complete)
      } else {
        complete()
      }
    }
  },
  events: ['beforeChange', 'afterChange']// 组件对外分发事件的声明,让用户重写
}
