let resolve = function(to, route) {
  return to ? '#!' + to : 'javascript:void(0)'
}

let match = function(to, route) {
  let regex = new RegExp('^'+to, 'g')
  return regex.test(route.path)
}

let component = {
  name: 'ms-router-link',
  template: '<!-- router-link -->',
  data () {
    return {
      active: false,
      path: ''
    }
  },
  props: {
    to: '',
    text: '',
    activeClass: 'active',
    tag: 'a'
  },
  beforeCreate () {
    this.path = resolve(this.to, avalon.router)
    if (this.tag === 'a') {
      component.template = `<a :attr="{href: path}" :class="{${this.activeClass}: active}" :html="text"></a>`
    } else {
      component.template = `<${this.tag} :class="{${this.activeClass}: active}"><a :attr="{href: path}" :html="text"></a></${this.tag}>`
    }
  },
  methods: {
    onReady () {
      avalon.router.subscribe(this.update)
    },
    onDispose () {
      avalon.router.unsubscribe(this.update)
    },
    update (route){
      this.active = match(this.to, route)
    }
  }
}

export default component

