import Panel from '@/components/base/Panel'
import Tabs from '@/components/base/Tabs'

let template = 
`
<ms-panel :ref="panel">
  <div slot="panel-bar">
    <ms-tabs :widget="[tabs1]" :ref="tabs1" />
    <ms-tabs :widget="[tabs2]" :ref="tabs2" />
  </div>
</ms-panel>
`

let tabTitle = [
  '<a href="javascript:void(0)">Tab1</a>',
  '<a href="javascript:void(0)">Tab2</a>',
  '<a href="javascript:void(0)">Tab3</a>',
]

let tabContent = [
  `<p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
  `,
  `<p>Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
  `,
  `<p>Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.  Pitchfork sustainable tofu synth chambray yr.</p>
  `
]

let tabs = []
avalon.each(tabTitle, (i, tab) => {
  tabs.push({
    title: tabTitle[i],
    content: tabContent[i]
  })
})

export default {
  name: 'ms-tabs-panel',
  template,
  data () {
    return {
      tabs1: {
        tabs,
        index: 0,
        trigger: 'hover',
        delay: 500
      },
      tabs2: {
        tabs,
        index: 0,
        trigger: 'click'
      }
    }
  },
  methods: {
    beforeSwitch (newIndex, oldIndex) {
      //avalon.log('beforeSwitch', newIndex, oldIndex)
    },
    afterSwitch (newIndex, oldIndex) {
      //avalon.log('afterSwitch', newIndex, oldIndex)
    }
  },
  // 模板书写组件:widget的值必须与ref一致,当前组件可通过ref对应的值获取到子组件的vmodel
  components: {
    Panel, 
    Tabs
  }
}
