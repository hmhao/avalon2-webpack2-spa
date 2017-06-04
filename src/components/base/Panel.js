var template =
`
<div class="panel" :class="[style ? 'panel-' + style : '']">
  <div class="panel-heading" :if="title">{{title}}</div>
  <div class="panel-body">
    <slot name="panel-bar"></slot>
  </div>
  <slot name="panel-table"></slot>
  <slot name="panel-list"></slot>
  <div class="panel-footer" :if="!noFooter"><slot name="panel-footer"></slot></div>
  <slot name="panel-dialog"></slot>
</div>
`

export default {
  name: 'ms-panel',
  template,
  data () {
    return {}
  },
  props: {
    title: '',
    style: 'default',
    noFooter: false
  }
}
