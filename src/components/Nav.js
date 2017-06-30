let template = 
`
<ul class="nav nav-pills nav-stacked">
  <ms-router-link :for="nav in navs" :widget="[{to: nav.path, activeClass: 'active', text: nav.title, tag: 'li'}]" />
</ul>
`

export default {
  name: 'ms-nav',
  template,
  data () {
    return {
      navs: [{
        title: '列表',
        path: '/list'
      },{
        title: '表格',
        path: '/grid'
      },{
        title: '下拉菜单',
        path: '/dropdown'
      },{
        title: '标签卡',
        path: '/tabs'
      },{
        title: '手风琴',
        path: '/accordion'
      },{
        title: '提示工具',
        path: '/tooltip'
      },{
        title: '日期选择',
        path: '/datepicker'
      },{
        title: '树组件',
        path: '/tree'
      },{
        title: '轮播',
        path: '/carousel'
      },{
        title: '嵌套路由',
        path: '/router'
      }]
    }
  }
}
