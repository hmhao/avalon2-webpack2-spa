import Panel from '@/components/base/Panel'

let template = 
`
<ms-panel :widget="[$panel]" :ref="panel">
  <div slot="panel-bar">
    <p>该项目不直接修改avalon2源码，只是在其基础上扩展。<a href="https://github.com/hmhao/avalon2-webpack2-spa">项目Github地址</a></p>
    <h3>说明</h3>
    <ul>
      <li>整合avalon2和webpack2，支持webpack热更新</li>
      <li>兼容性支持IE8以下，IE8以下禁用热更新，需要手动刷新</li>
      <li>[采用ES6、类vue的单文件组件书写](#component)
      （avalon组件只使用defaults来定义组件VM的属性与方法，在书写时非常混乱）</li>
      <li>加入官网路由并改造，实现嵌套路由(使用<a href="https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/link.js" target="_blank">ms-router-link</a>和<a href="https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/view.js" target="_blank">ms-router-view</a>)，支持路由懒加载(<a href="https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/index.js" target="_blank">参考</a>)</li>
      <li>加入cookie_js、<a href="https://github.com/hmhao/avalonx">avalonx(状态管理)</a></li>
    </ul>
    <h3>组件书写</h3>
    <ul>
      <li>data：组件内部属性</li>
      <li>props：来自父组件的数据</li>
      <li>computed：组件计算属性</li>
      <li>methods：组件方法及钩子函数</li>
      <li>watch：组件内部观察属性变化</li>
      <li>filters：组件自定义过滤器</li>
      <li>events：组件对外分发事件的声明</li>
      <li>components：组件依赖的子组件</li>
      <li>beforeCreate：组件创建vm前会调用，可用于vm数据校验或补充</li>
      <li>afterCreate：组件创建vm后会调用</li>
    </ul>
  </div>
</ms-panel>
`

export default {
  name: 'ms-index-panel',
  template,
  data () {
    return {
      $panel: {
        noFooter: true
      }
    }
  },
  components: {
    Panel
  }
}
