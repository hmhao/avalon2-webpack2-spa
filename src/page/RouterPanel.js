import Panel from '@/components/base/Panel'

let template = 
`
<ms-panel>
  <div slot="panel-bar">
    <h1>Basic</h1>
    <ul>
      <li><ms-router-link :widget="[{to: '/router', text: '/'}]"/></li>
      <li><ms-router-link :widget="[{to: '/router/foo', text: '/foo'}]"/></li>
      <li><ms-router-link :widget="[{to: '/router/bar', text: '/bar'}]"/></li>
      <li><ms-router-link :widget="[{to: '/router/bar/baz', text: '/bar/baz'}]"/></li>
    </ul>
    <ms-router-view />
  </div>
</ms-panel>
`

export default {
  name: 'ms-router-panel',
  template,
  data () {
    return {
    }
  },
  components: {
    Panel
  }
}
