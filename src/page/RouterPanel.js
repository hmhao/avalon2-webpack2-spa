import Panel from '@/components/base/Panel'

let template = 
`
<ms-panel>
  <div slot="panel-bar">
    <h1>Basic</h1>
    <ul>
      <li><a href="#!/router">/</a></li>
      <li><a href="#!/router/foo">/foo</a></li>
      <li><a href="#!/router/bar">/bar</a></li>
      <li><a href="#!/router/bar/baz">/bar/baz</a></li>
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
