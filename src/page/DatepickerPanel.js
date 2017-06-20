import Panel from '@/components/base/Panel'

let template = 
`
<ms-panel :widget="{noFooter: true}">
  <div slot="panel-bar">
    <input type="text" :datepicker="{placement: 'bottom'}" />
    <input type="text" :datepicker="{placement: 'top'}" />
  </div>
</ms-panel>
`

export default {
  name: 'ms-datepicker-panel',
  template,
  data () {
    return {
    }
  },
  components: {
    Panel
  }
}
