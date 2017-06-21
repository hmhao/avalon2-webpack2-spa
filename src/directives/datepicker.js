let template = 
`
<div class="datepicker dropdown-menu" 
     :css="{display: visible ? 'block' : 'none'}">
  <div class="datepicker-days" style="display: block;">
    <table class="table-condensed">
      <thead>
        <tr>
          <th class="prev" :click="dealYear(-1)"><i class="icon-backward"></i></th>
          <th class="prev" :click="dealMonth(-1)"><i class="icon-chevron-left"></i></th>
          <th class="datepicker-switch" colSpan="3" :click="toggleYearMonth">{{YearMonth}}</th>
          <th class="next" :click="dealMonth(1)"><i class="icon-chevron-right"></i></th>
          <th class="next" :click="dealYear(1)"><i class="icon-forward"></i></th>
        </tr>
        <tr>
          <th class="dow" :for="weekday in $weekdays">{{weekday}}</th>
        </tr>
      </thead>
      <tbody>
        <tr :for="el in data">
          <td class="day" :for="day in el" :class="{old : day.month < month, 'new': day.month > month, active: day.selected}" :click="chooseDay(day)">
            {{day.value}}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="datepicker-year-month datepicker-dropdown dropdown-menu datepicker-orient-center datepicker-orient-bottom" :css="{display: visibleYearMonth ? 'block' : 'none'}">
    <table class="table-condensed">
      <tbody>
        <tr :for="($index,el) in yearScope">
          <td colSpan="2"
              :if="$index !== yearScope.length - 1"
              :click="chooseYear(el.value)">
            <span :class="{active: year === el.value}">{{el.value}}年</span>
          </td>
          <td :if="$index === yearScope.length - 1" :click="dealYearScope(-5)">
            <span><i class="icon-chevron-left"></i></span>
          </td>
          <td :if="$index === yearScope.length - 1" :click="dealYearScope(5)">
            <span><i class="icon-chevron-right"></i></span>
          </td>
          <td colSpan="2" :click="chooseMonth(2 * $index + 1)">
            <span :class="{active: month === 2 * $index + 1}">{{$months[2 * $index]}}</span>
          </td>
          <td colSpan="2" :click="chooseMonth(2 * $index + 2)">
            <span :class="{active: month === 2 * $index + 2}">{{$months[2 * $index + 1]}}</span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <div class="datepicker-time">
    <input class="input-hour" type="text" :attr="{value: hour}" />
    <span>:</span>
    <input class="input-minute" type="text" :attr="{value: minute}" />
    <span>:</span>
    <input class="input-second" type="text" :attr="{value: second}" />
  </div>
  <div class="datepicker-btn">
    <button type="button" class="btn btn-default btn-small" :click="setToday()">今天</button>
    <button type="button" class="btn btn-default btn-small" :click="clear()">清空</button>
    <button type="button" class="btn btn-default btn-small" :click="cancel()">取消</button>
  </div>
</div>
`

function padd0 (val){
  return val < 10 ? ("0" + val) : val;
}

let datepickerDefault = {
  name: 'datepicker',
  visible: false,
  visibleYearMonth: false,
  year: '',
  month: '',
  day: '',
  hour: '',
  minute: '',
  second: '',
  placement: 'bottom',
  format: "yyyy-MM-dd hh:mm:ss",
  data: [],
  yearScope: [],
  $input: '',
  $datepicker: '',
  $date: '',
  $weekdays: ['日','一','二','三','四','五','六'],
  $months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
  $computed: {
    YearMonth () {
      return this.year + '年' + this.$months[this.month - 1]
    }
  },
  dealYearScope (d) {
    avalon.each(this.yearScope, (i, v) => {
      v.value += d
    })
  },
  dealYear (d) {
    this.year += d
    this.dealData()
  },
  dealMonth (d) {
    if (d === 1 && this.month === 12) {
      this.month = 1
      this.year++
      if (this.yearScope[4].value < this.year) {
        this.dealYearScope(5)
      }
    } else if(d === -1 && this.month === 1) {
      this.month = 12
      this.year--
      if (this.yearScope[0].value > this.year) {
        this.dealYearScope(-5)
      }
    } else {
      this.month += d
    }
    this.dealData()
  },
  dealData () {
    let $date = this.$date
    let date =  new Date()
    date.setFullYear(this.year)
    date.setDate(1)
    date.setMonth(this.month - 1)
    //二维数组
    let data = []
    //第一天星期几
    let firstDay = date.getDay()
    if(firstDay === 0){
      //第一天是星期日 则上月最后7日组成一行
      date.setDate(date.getDate() - 7)
    }else{
      date.setDate(date.getDate() - firstDay)
    }
    let j=0;
    for (let i=1; i<=42; i++) {
      let target = data[j]
      if (!target) {
        target = data[j] = []
      }
      if (target.length < 7) {
        let value = date.getDate()
        let month = date.getMonth() + 1
        let selected = !!($date && value === $date.getDate() && month === $date.getMonth() + 1 
             && date.getFullYear() === $date.getFullYear())
        target.push({
          value,
          month,
          selected
        })
        date.setDate(date.getDate() + 1)
      } else {
        j++
        i--
      }
    }
    this.data = data
  },
  toggleYearMonth () {
    let years = []
    for(let i = this.year - 2; i<= this.year + 3; i++){
      years.push({value: i})
    }
    this.yearScope = years
    this.visibleYearMonth = !this.visibleYearMonth
  },
  clear () {
    this.updateInput('')
  },
  cancel () {
    this.$input.value = this.$input.lastValue
    this.setValue(this.$date = new Date(this.$input.lastValue.replace(/-/g,'/')))
    this.visible = !this.visible
  },
  chooseYear (year){
    this.year = year
    this.dealData()
  },
  chooseMonth (month){
    this.month = month
    this.dealData()
  },
  chooseDay (day) {
    if(day.month !== this.month) return
    avalon.each(this.data, (i, row) => {
      let isBreak = false
      avalon.each(row, (i, col) => {
        if (col.selected) {
          col.selected = false
          isBreak = true
          return false
        }
      })
      if (isBreak) {
        return false
      }
    })
    day.selected = true
    this.day = day.value
    let date = this.$date
    if(date){
      date.setFullYear(this.year)
      date.setMonth(this.month - 1)
      date.setDate(day.value)
      date.setHours(this.hour)
      date.setMinutes(this.minute)
      date.setSeconds(this.second)
    }else{
      date = this.$date = this.getDate()
    }
    this.updateInput(date)
  },
  setToday () {
    this.setValue(this.$date = new Date())
    this.updateInput(this.$date)
  },
  getDate (){
    return new Date(this.year + '/' + this.month + '/' + this.day + ' ' + this.hour + ':' + 
      this.minute + ':' + this.second)
  },
  getValue (){
    let date = this.getDate()
    return avalon.filters.date(date, this.format)
  },
  setValue (date) {
    if (date) {
      this.year = date.getFullYear()
      this.month = date.getMonth() + 1
      this.day = date.getDate()
      this.hour = padd0(date.getHours())
      this.minute = padd0(date.getMinutes())
      this.second = padd0(date.getSeconds())
    } 
    this.dealData()
  },
  updateInput (date) {
    let value = ''
    if (date) {
      value = this.getValue()
      this.onChoose(value, date)
    }
    this.$input.value = value
  },
  _onVisible (value) {
    if (value && !this.$input.value) {
      this.setValue(this.$date = new Date())
    }
    this.$input.lastValue = this.$input.value
  },
  onChoose: avalon.noop//事件声明
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
  clickHandler (evt) {
    avalon.each(utilListener._queue, (k, action) => {
      let vm = action.datepickerVM
      if (vm && vm.visible) {
        let parent = avalon(evt.target).parent('.datepicker')
        if (!parent.element) {
          vm.visibleYearMonth = false
          vm.visible = false
        }
      }
    })
  },
  resizeHandler (evt) {
    avalon.each(utilListener._queue, (k, action) => {
      let vm = action.datepickerVM
      if (vm) {
        action.updatePosition(vm.$input, vm.$datepicker, vm.placement)
      }
    })
  }
}

export default {
  name: 'datepicker',
  priority: 5,
  init () {
    let input = this.node.dom
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
  beforeDispose () {
    let input = this.node.dom
    avalon.unbind(input, 'click', this._onEventHandler)
    utilListener.remove(this)
    if (!utilListener.length) {
      avalon.unbind(document, 'click', utilListener.clickHandler)
      avalon.unbind(window, 'resize', utilListener.resizeHandler)
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
    let target = evt.currentTarget
    let parent = target.parentNode
    let datepickerVM = this.datepickerVM
    if (!datepickerVM) {
      let data = this.value
      let definition = avalon.mix({}, datepickerDefault, {
        $id: avalon.makeHashCode('datepicker'),
        $input: target,
        visible: true//初始化需要先设置可见，然后计算位置才准确
      }, data)
      
      datepickerVM = this.datepickerVM = avalon.define(definition)
      datepickerVM._onVisible(true)//由于上面设置了可见，这里需要手动执行一次
      datepickerVM.$watch('visible', datepickerVM._onVisible)

      let render = avalon.scan(template, datepickerVM)
      let datepicker = datepickerVM.$datepicker = render.root.dom
      let container = target.parentNode || document.body
      container.appendChild(datepicker)

      this.updatePosition(target, datepicker, definition.placement)
    }

    if (!datepickerVM.visible) {
      datepickerVM.visible = true
    }
    evt.stopPropagation()
  }
}
