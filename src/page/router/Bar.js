let template = 
`
<div>
  <h2>{{ msg }}</h2>
  <ms-router-view />
</div>
`

export default {
  name: 'ms-router-bar',
  template,
  data () {
    return { msg: 'This is Bar!' }
  }
}
