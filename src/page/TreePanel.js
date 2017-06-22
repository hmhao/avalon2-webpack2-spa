import Panel from '@/components/base/Panel'
import Tree from '@/components/base/Tree'

let template = 
`
<ms-panel :ref="panel">
  <div slot="panel-bar">
    <ms-tree :widget="[tree]" :ref="tree" />

    <button class="btn" :click="getSelected">获取选中项</button>
    <button class="btn" :click="getParents">获取选中项的所有父节点</button>
    <button class="btn" :click="expand">展开选中项的子项</button>
    <button class="btn" :click="collapse">收起选中项的子项</button>
    <br>
    <div class="input-prepend input-append">
      <span class="add-on">路径</span>
      <input class="span2" type="text" :duplex="path">
      <button class="btn" :click="getNode">获取指定项</button>
      <button class="btn" :click="expandTo">展开到指定项并选中</button>
    </div>
  </div>
</ms-panel>
`

export default {
  name: 'ms-tree-panel',
  template,
  data () {
    return {
      tree: {
        $checkbox: true,
        $nodeIcon: 'icon-bookmark',
        $checkedIcon: 'icon-ok-sign',//选中的复选框图标
        $uncheckedIcon: 'icon-ok-circle',//没选中的复选框图标
        $expandIcon: 'icon-chevron-down',//展开图标
        $collapseIcon: 'icon-chevron-right',//收起图标
        nodes:[{
          'text': 'node1'
        }, {
          'text': 'node2',
          'state': 'expand',
          'nodes': [{
            'text': 'node21',
            'nodes': [{
              'text': 'node211'
            },{
              'text': 'node212'
            }]
          },{
            'text': 'node22'
          }]
        }, {
          'text': 'node3'
        }]
      },
      path: '100'
    }
  },
  methods: {
    getSelected () {
      avalon.log(this.$$ref.tree.getSelected())
    },
    getParents () {
      let tree = this.$$ref.tree
      let selected = tree.getSelected()
      if(selected){
        avalon.log(tree.getParents(selected))
      }
    },
    expand () {
      let tree = this.$$ref.tree
      let selected = tree.getSelected()
      tree.expandNode(selected)
    },
    collapse () {
      let tree = this.$$ref.tree
      let selected = tree.getSelected()
      tree.collapseNode(selected)
    },
    getNode () {
      avalon.log(this.$$ref.tree.getNode(this.path))
    },
    expandTo (){//展开到指定节点
      let tree = this.$$ref.tree
      let target = tree.getNode(this.path)
      let parents = tree.getParents(target)
      avalon.each(parents, function(i, el){
        tree.expandNode(el)
      })
      tree.toggleSelect(target)
    }
  },
  // 模板书写组件:widget的值必须与ref一致,当前组件可通过ref对应的值获取到子组件的vmodel
  components: {
    Panel, 
    Tree
  }
}
