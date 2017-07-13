import Panel from '@/components/base/Panel'
import Datepicker from '@/components/base/Datepicker'

let template = 
`
<ms-panel :widget="{noFooter: true}">
  <div slot="panel-bar">
    <h1>指令：</h1>
    <div class="input-append">
      <input type="text" :datepicker="{placement: 'bottom'}">
      <span class="add-on"><i class="icon-calendar"></i></span>
    </div>
    <div class="input-append">
      <input type="text" :datepicker="{placement: 'top'}" />
      <span class="add-on"><i class="icon-calendar"></i></span>
    </div>
    <input type="text" :datepicker="$datepicker3">
    <h1>组件:</h1>
    <ms-datepicker :widget="[$datepicker4]"/>
    <p>{{date}}</p>
  </div>
</ms-panel>
`

export default {
  name: 'ms-datepicker-panel',
  template,
  data () {
    return {
      date: '',
      $datepicker3: {
        placement: 'bottom',
        format: 'yyyy/MM/dd',
        $date: '2017/07/28',
        $timesActive: false
      },
      $datepicker4: {
        $date: '2017/06/28',
        format: 'yyyy-MM-dd'
      }
    }
  },
  methods: {
    onChoose (value, date) {
      this.date = value
    },
  },
  components: {
    Panel,
    Datepicker
  }
}
