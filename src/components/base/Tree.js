let _template =
`
<li MS_FOR class="tree-node">
  <i :if="el.nodes && el.nodes.length" :click="toggleState(el)"
     :class="el.state==='collapse' ? el.$collapseIcon : el.$expandIcon"></i>
  <i class="tree-checkbox"
     :if="el.$checkbox" :click="toggleCheck(el)"
     :class="[el.checked ? el.$checkedIcon : el.$uncheckedIcon, 'tree-checkbox' + el.checked]" ></i>
  <span class="tree-node-content" :class="{'tree-node-select':el.selected}" :click="toggleSelect(el)" >
    <i class="icon" :class="el.$nodeIcon"></i>
    <span class="tree-text">{{el.text}}</span>
  </span>
  <ul :if="el.nodes && el.nodes.length" :visible="el.state==='expand'" :html="getNodesTpl(el)"></ul>
</li>
`

let rootTemplate = _template.replace('MS_FOR',':for="($index,el) in nodes"')
let nodesTemplate = _template.replace('MS_FOR',':for="($index,el) in el.nodes"')

let template =
`
<ul class="tree">${rootTemplate}</ul>
`

let treenodeDefault = {
  nodes: [],
  $path: '',
  $nodeIcon: '',
  $expandIcon: '',
  $collapseIcon: '',
  $checkbox: false,
  $checkedIcon: '',
  $uncheckedIcon: '',
  text: '',
  checked: 0,
  selected: false,
  state: ''
}

let util = {
  initTreeNode (vm, nodes, path) {
    path = path || ''
    avalon.each(nodes, (i, node) => {
      for(let key in treenodeDefault){
        if(node[key] === undefined){
          node[key] = key !== 'nodes' ? (vm[key] || treenodeDefault[key]) : treenodeDefault[key]
        }
      }
      if (!node.state) node.state = 'collapse'
      node.$path = path + i
      if (node.nodes && node.nodes.length) {
        node.nodes = this.initTreeNode(vm, node.nodes, node.$path)
      }
    })
    return nodes
  },
  eachNode (nodes, cb) {//遍历nodes中的所有节点，若传入回调则执行回调
    avalon.each(nodes, (i, node) => {
      if (node) {
        if (cb && cb(node, i, nodes) === false) {
          return false
        }
        let _nodes = node.nodes
        if (_nodes && _nodes.length > 0 && this.eachNode(_nodes, cb) === false) {
          return false
        }
      }
    })
  },
  getNode (nodes, path) {//根据path获取节点
    path = path.split('')
    let node, i, len
    for (i = 0, len = path.length; i < len; i++) {
        node = nodes[path[i]]
        if (node && node.nodes && node.nodes.length) {
          nodes = node.nodes
        } else {
          break
        }
    }
    return i >= len - 1 ? node : null
  },
  getParents (nodes, target) {//获取target的所有父节点
    let parents = []
    let path = target.$path.split('')
    for(let i = 0, len = path.length, index, node; i < len - 1; i++){
      index = path[i]
      node = nodes[index]
      parents.push(node)
      nodes = node.nodes
    }
    return parents
  }
}

export default {
  name: 'ms-tree',
  template,
  data () {
    return {
      $lastSelect: null
    }
  },
  props: {
    nodes: [],//节点
    $nodeIcon: '',//节点是否带图标
    $checkbox: false,//节点是否带checkbox
    $checkedIcon: 'icon-check',//选中的复选框图标
    $uncheckedIcon: 'icon-unchecked',//没选中的复选框图标
    $expandIcon: 'icon-minus',//展开图标
    $collapseIcon: 'icon-plus',//收起图标
    $cascadeCheck: true,//是否级联检查
  },
  beforeCreate () {
    util.initTreeNode(this, this.nodes)
  },
  methods: {
    onReady () {
    },
    getNodesTpl (el) {
      return nodesTemplate
    },
    getTarget (el) {
      let target = {}
      if (avalon.isPlainObject(el)) {
        target.$model = el
        target.node = util.getNode(this.nodes, el.$path)
      } else {
        target.node = el
        target.$model = el.$model
      }
      return target
    },
    toggleState (el, expand) {
      let target = this.getTarget(el),
          node = target.node,
          $model = target.$model

      expand = avalon.type(expand) != 'undefined' ? expand : node.state === 'collapse'

      if (expand) {
        if (this.onBeforeExpand($model) === false) {
          return
        }
        node.state = 'expand'
        this.onExpand($model)
      } else {
        if (!el || this.onBeforeCollapse($model) === false) {
          return
        }
        node.state = 'collapse'
        this.onCollapse($model)
      }
    },
    toggleCheck (el, checked) {
      let target = this.getTarget(el),
          node = target.node,
          $model = target.$model

      if (checked === undefined) {
        let _checked = node.checked
        if (_checked === 1) {
          checked = node.checked = 0
        }else{
          checked = node.checked = 1
        }
      } else {
        node.checked = checked
      }
      checked === 1 && this.onCheck($model)
      if (this.$cascadeCheck) {
        if (node.nodes.length) {
          //勾选或反选所有子节点
          util.eachNode(node.nodes, function (node) {
            node.checked = checked
          })
        }
        if (node.$path.length > 1) {
          let parents = util.getParents(this.nodes, node)
          if (checked === 1) {
            //如果是勾选 则将所有父节点置为预选状态
            avalon.each(parents, function(i, node){
              node.checked = 2
            })
          }else{
            avalon.each(parents.reverse(), function (i, node) {
              let flag = 0
              //遍历所有父节点 查看其下所有子节点是否都没有勾选，若是则置为反选
              util.eachNode(node.nodes, function (n) {
                if(n.checked === 1){
                  flag = 2
                  return false
                }
              })
              node.checked = flag
            })
          }
        }
      }
    },
    toggleSelect (el) {
      let target = this.getTarget(el),
          node = target.node,
          $model = target.$model
      if (this.onBeforeSelect($model) === false) {
        return
      }

      if (this.$lastSelect) {
        this.$lastSelect.selected = false
      }
      if(this.$lastSelect === node) return this.$lastSelect = null
      node.selected = true
      this.$lastSelect = node
      this.onSelect($model)
    },
    expandNode (el) {
      el && this.toggleState(el, true)
    },
    collapseNode (el) {
      el && this.toggleState(el, false)
    },
    getNode (path) {
      return util.getNode(this.nodes.toJSON(), path)
    },
    getParents (target) {
      return util.getParents(this.nodes.toJSON(), target)
    },
    getSelected () {
      return this.$lastSelect && this.$lastSelect.$model
    },
  },
  events: ['onBeforeSelect','onSelect','onBeforeExpand','onExpand','onBeforeCollapse','onCollapse','onBeforeLoad','onCheck']// 组件对外分发事件的声明,让用户重写
}
