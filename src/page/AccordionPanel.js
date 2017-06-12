import Panel from '@/components/base/Panel'
import Accordion from '@/components/base/Accordion'

let template = 
`
<ms-panel :widget="{noFooter: true}">
  <div slot="panel-bar">
    <ms-accordion :widget="[accordion1]" :ref="accordion1"/>
    <ms-accordion :widget="[accordion2]" />
  </div>
</ms-panel>
`

let accordionTitle = [
  '<a href="javascript:void(0)">Collapsible Group Item #1</a>',
  '<a href="javascript:void(0)">Collapsible Group Item #2</a>',
  '<a href="javascript:void(0)">Collapsible Group Item #3</a>',
]

let accordionContent = [
  `<p>Nesciunt tofu stumptown aliqua, retro synth master cleanse. Mustache cliche tempor, williamsburg carles vegan helvetica. Reprehenderit butcher retro keffiyeh dreamcatcher synth. Cosby sweater eu banh mi, qui irure terry richardson ex squid. Aliquip placeat salvia cillum iphone. Seitan aliquip quis cardigan american apparel, butcher voluptate nisi qui.</p>
  `,
  `<p>Exercitation +1 labore velit, blog sartorial PBR leggings next level wes anderson artisan four loko farm-to-table craft beer twee. Qui photo booth letterpress, commodo enim craft beer mlkshk aliquip jean shorts ullamco ad vinyl cillum PBR. Homo nostrud organic, assumenda labore aesthetic magna delectus mollit. Keytar helvetica VHS salvia yr, vero magna velit sapiente labore stumptown. Vegan fanny pack odio cillum wes anderson 8-bit, sustainable jean shorts beard ut DIY ethical culpa terry richardson biodiesel. Art party scenester stumptown, tumblr butcher vero sint qui sapiente accusamus tattooed echo park.</p>
  `,
  `<p>Messenger bag gentrify pitchfork tattooed craft beer, iphone skateboard locavore carles etsy salvia banksy hoodie helvetica. DIY synth PBR banksy irony. Leggings gentrify squid 8-bit cred pitchfork.  Pitchfork sustainable tofu synth chambray yr.</p>
  `
]

let accordion = []
avalon.each(accordionTitle, (i) => {
  accordion.push({
    title: accordionTitle[i],
    content: accordionContent[i]
  })
})
accordion[0].active = true

export default {
  name: 'ms-accordion-panel',
  template,
  data () {
    return {
      accordion1: {
        accordion
      },
      accordion2: {
        accordion,
        multiple: true
      }
    }
  },
  methods: {
    onExpand (item) {
      //avalon.log('onExpand', item)
    },
    onCollapse (item) {
      //avalon.log('onCollapse', item)
    }
  },
  components: {
    Panel,
    Accordion
  }
}
