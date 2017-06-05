import Panel from '@/components/base/Panel'
import Dropdown from '@/components/base/Dropdown'
import DropdownLi from '@/components/base/DropdownLi'

let template = 
`
<ms-panel :widget="[$$ref.panel]">
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
        list: ['1', '2', '', '3', '4']
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
  // 模板书写组件:widget的值必须与ref一致,当前组件可通过ref对应的值获取到子组件的vmodel
  components: [{
    component: Panel,
    $$ref: 'panel',
    props: {
      noFooter: true
    }
  }, Dropdown, DropdownLi]
}
