import Header from '@/components/Header'
import Footer from '@/components/Footer'
import Nav from '@/components/Nav'
import Alert from '@/components/base/Alert'
import Ref from '@/directives/ref'
import Tooltip from '@/directives/tooltip'
import Datepicker from '@/directives/datepicker'
import Placeholder from '@/directives/placeholder'

import '@/assets/css/style.css'

let template = 
`
<div>
  <ms-header/>
  <div class="container">
    <div class="row">
      <div class="span2">
        <ms-nav />
      </div>
      <div class="span10">
        <ms-router-view />
      </div>
    </div>
    <ms-alert :widget="[{global: true}]" />
  </div>
  <ms-footer />
</div>
`

export default {
  name: 'app',
  template,
  data () {
    return {}
  },
  components: {
    Header,
    Footer,
    Nav,
    Alert
  },
  directives: {
    Ref,
    Tooltip,
    Datepicker,
    Placeholder
  }
}
