let template = 
`
<div class="datepicker" :class="[$directive ? 'dropdown-menu' : 'datepicker-inline']">
  <div class="datepicker-days" style="display: block;">
    <table class="table-condensed">
      <thead>
        <tr>
          <th class="prev" :click="dealYear(-1)"><i class="icon-backward"></i></th>
          <th class="prev" :click="dealMonth(-1)"><i class="icon-chevron-left"></i></th>
          <th class="datepicker-switch" colSpan="3" :click="toggleYearMonth" :class="{active: visibleYearMonth}">{{YearMonth}}</th>
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
      <tfoot>
        <tr :visible="$timesActive">
          <th colSpan="7">
            <div class="datepicker-time">
              <input class="input-hour" type="text" maxLength="2" :duplex="hour | change" :change="changeTime($event, 'hour')"/>
              <span>:</span>
              <input class="input-minute" type="text" maxLength="2" :duplex="minute | change" :change="changeTime($event, 'minute')"/>
              <span>:</span>
              <input class="input-second" type="text" maxLength="2" :duplex="second | change" :change="changeTime($event, 'second')" />
            </div>
          </th>
        </tr>
        <tr>
          <th class="today" colSpan="7" :visible="!$directive" :click="setToday()">今天</th>
          <th colSpan="7" :visible="$directive">
            <div class="datepicker-btn">
              <button type="button" class="btn btn-default" :click="setToday()">今天</button>
              <button type="button" class="btn btn-default" :click="clear()">清空</button>
              <button type="button" class="btn btn-default" :click="cancel()">取消</button>
            </div>
          </th>
        </tr>
      </tfoot>
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
</div>
`

function padd0 (val){
  return val < 10 ? ("0" + val) : val;
}

export default {
  name: 'ms-datepicker',
  template,
  data () {
    return {
      visibleYearMonth: false,
      year: '',
      month: '',
      day: '',
      hour: '',
      minute: '',
      second: '',
      data: [],
      yearScope: [],
      $weekdays: ['日','一','二','三','四','五','六'],
      $months: ['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月'],
    }
  },
  props: {
    $directive: false,
    $timesActive: false,
    $date: '',
    format: 'yyyy-MM-dd HH:mm:ss'
  },
  computed: {
    YearMonth () {
      return this.year ? this.year + '年' + this.$months[this.month - 1] : ''
    }
  },
  methods: {
    onReady () {
      if (this.$date && avalon.type(this.$date) === 'string') {
        try {
          this.$date = new Date(this.$date)
        } catch (e) {
          this.$date = new Date()
        }
      }
      if (!(this.$date instanceof Date)) {
        this.$date = new Date()
      }
      this.setValue(this.$date)
    },
    onDispose () {
      
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
      this.onClear()
    },
    cancel () {
      this.onCancel()
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
      this.onChoose(this.getValue(), date)
    },
    changeTime (event, type) {
      let value = event.currentTarget.value
      let date = this.$date
      switch (type) {
        case 'hour':
          this.hour = padd0(parseInt(value) % 24 || 0)
          date.setHours(this.hour)
          break;
        case 'minute':
          this.minute = padd0(parseInt(value) % 60 || 0)
          date.setMinutes(this.minute)
          break;
        case 'second':
          this.second = padd0(parseInt(value) % 60 || 0)
          date.setSeconds(this.second)
          break;
      }
      
      this.onChoose(this.getValue(), this.$date)
    },
    setToday () {
      this.setValue(this.$date = new Date())
      this.onChoose(this.getValue(), this.$date)
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
    }
  },
  events: ['onChoose', 'onClear', 'onCancel']// 组件对外分发事件的声明,让用户重写
}
