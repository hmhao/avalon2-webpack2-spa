import Panel from '@/components/base/Panel'

let template = 
`
<ms-panel :widget="{noFooter: true}">
  <div slot="panel-bar">
    <a class="btn" :for="type in tooltip" :tooltip="{title: 'tooltip ' + type, trigger: 'hover', placement: type}">tooltip {{type}}</a>
    <br>
    <a class="btn" :for="type in popover" :tooltip="{title: 'popover ' + type, trigger: 'click', placement: type, content: 'content 123456789'}">popover {{type}}</a>
  </div>
</ms-panel>
`

export default {
  name: 'ms-tooltip-panel',
  template,
  data () {
    return {
      tooltip: ['left', 'top', 'bottom', 'right'],
      popover: ['left', 'top', 'bottom', 'right']
    }
  },
  components: {
    Panel
  }
}
