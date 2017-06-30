export default {
  name: 'ms-router-view',
  template: '<!-- router-view -->',
  data () {
    return {
      $container: '',
      $innerRender: '',
      component: ''
    }
  },
  methods: {
    onReady () {
      this.$container = this.$element.parentNode
      avalon.router.subscribe(this.update)
    },
    onDispose () {
      if (this.$innerRender) {
        this.$innerRender.dispose()
        this.$innerRender = ''
      }
      this.$container = ''
      avalon.router.unsubscribe(this.update)
    },
    update (route){
      let componentName = route.matched[route.depth++]
      if (componentName) {
        this.component = `<xmp :widget="{is: '${componentName}', id: '${componentName}'}"></xmp>`
      } else {
        this.component = ''
      }
    }
  },
  watch: {
    component (value) {
      if (this.$innerRender) {
        this.$container.replaceChild(this.$element, this.$innerRender.root.dom)
        this.$innerRender.dispose()
        this.$innerRender = ''
      }
      if (value) {
        this.$innerRender = avalon.scan(value)
        this.$container.replaceChild(this.$innerRender.root.dom, this.$element)
      }
    }
  }
}

