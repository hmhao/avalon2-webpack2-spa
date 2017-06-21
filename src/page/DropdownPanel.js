import Panel from '@/components/base/Panel'
import Dropdown from '@/components/base/Dropdown'
import DropdownLi from '@/components/base/DropdownLi'

let template = 
`
<ms-panel :widget="{noFooter: true}">
  <div slot="panel-bar">
    <ms-dropdown :for="d in dropdowns" :widget="[d]" />
    <ul class="nav nav-pills">
      <li class="active"><a href="#">Regular link</a></li>
      <ms-dropdown-li :for="d in dropdownlis" :widget="[d]" />
    </ul>
  </div>
</ms-panel>
`

export default {
  name: 'ms-dropdown-panel',
  template,
  data () {
    return {
      dropdowns: [{
        type: 'btn-group',
        text: 'abc',
        list: ['1', '2', '', '3', '4']
      }, {
        text: 'efg',
        trigger: 'hover',
        reverse: true,
        list: [{
          text: 'baidu',
          href: 'http://www.baidu.com',
          cb (evt) {
            return evt.preventDefault()
          }
        }, {
          text: 'qq',
          href: 'http://www.qq.com'
        }]
      }],
      dropdownlis: [{
        text: 'abc',
        list: ['1', '2', '', '3', '4'],
        reverse: true
      }, {
        text: 'efg',
        trigger: 'hover',
        list: [{
          text: 'baidu',
          href: 'http://www.baidu.com',
          cb (evt) {
            return evt.preventDefault()
          }
        },
        '', 
        {
          text: 'qq',
          href: 'http://www.qq.com'
        }]
      }]
    }
  },
  components: {
    Panel, 
    Dropdown, 
    DropdownLi
  }
}
