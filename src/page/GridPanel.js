import Panel from '@/components/base/Panel'
import Grid from '@/components/base/Grid'
import Alert from '@/components/base/Alert'
import Mock from 'mockjs'

let template = 
`
<ms-panel>
  <div slot="panel-bar">
    <ms-grid :widget="[$grid1]" :ref="grid1" />
    <button class="btn" :click="getSelected(1)">获取选中项全局输出</button>
    <button class="btn" :click="addData()">追加数据</button>
    <ms-grid :widget="[$grid2]" :ref="grid2" />
    <button class="btn" :click="getSelected(2)">获取选中项当前输出</button>
    <ms-alert :ref="msg" />
  </div>
</ms-panel>
`

export default {
  name: 'ms-grid-panel',
  template,
  data () {
    return {
      $grid1: {
        title: '表格1',
        columns: [
          {field: 'a1',title: 'a1', sort: true},
          {field: 'a2',title: 'a2'},
          {field: 'a3',title: 'a3'}
        ],
        multiple: false
      },
      $grid2: {
        title: '表格2',
        columns: [
          {field: 'a1',title: 'a1'},
          {field: 'a2',title: 'a2', sort: true},
          {field: 'a3',title: 'a3', sort: true}
        ],
        pageSize: 8
      },
      getSelected (index) {
        if (index == 1) {
          avalon.alert({
            text: avalon._quote(this.$$ref.grid1.getSelected())
          })
        } else if (index == 2) {
          this.$$ref.msg.alert({
            text: avalon._quote(this.$$ref.grid2.getSelected()), 
            autoClose: false
          })
        }
      },
      addData () {
        this.$$ref.grid1.setData(Mock.mock({
        // 属性 list 的值是一个数组，其中含有 10 到 30 个元素
        'list|10': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 11,
          'a1': '@ctitle',
          'a2': '@datetime("yyyy-MM-dd HH:mm")',
          'a3|100-10000': 100
        }]
      }).list, true)
      }
    }
  },
  methods: {
    onReady () {
      this.$$ref.grid1.setData(Mock.mock({
        // 属性 list 的值是一个数组，其中含有 10 到 30 个元素
        'list|10': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1,
          'a1': '@ctitle',
          'a2': '@datetime("yyyy-MM-dd HH:mm")',
          'a3|100-10000': 100
        }]
      }).list)
      this.$$ref.grid2.setData(Mock.mock({
        // 属性 list 的值是一个数组，其中含有 10 到 30 个元素
        'list|10-30': [{
          // 属性 id 是一个自增数，起始值为 1，每次增 1
          'id|+1': 1,
          'a1': '@ctitle',
          'a2': '@datetime("yyyy-MM-dd HH:mm")',
          'a3|100-10000': 100
        }]
      }).list)
    }
  },
  components: {
    Panel,
    Grid,
    Alert
  }
}
