import Dropdown from '@/components/base/Dropdown'

var template =
`
<li class="dropdown" :class="[open && 'open', reverse && 'dropup']" 
     :mouseenter="toggle($event, true)" 
     :mouseleave="toggle($event, false)" 
     :click="toggle($event)">
  <a class="dropdown-toggle" href="javascript:void(0)">
    {{text}}
    <span class="caret"></span>
  </a>
  <ul class="dropdown-menu">
    <li :for="l in list" :class="{divider: !l}">
      <a tabindex="-1" :if="!!l" 
        :attr="{href: l.href ? l.href : 'javascript:void(0)'}" 
        :click="l.cb ? l.cb($event) : avalon.noop($event)">
        {{l.text}}
      </a>
    </li>
  </ul>
</li>
`

export default avalon.mix({}, Dropdown, {
  name: 'ms-dropdown-li',
  template,
})
