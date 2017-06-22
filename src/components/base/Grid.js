import Pagination from '@/components/base/Pagination'

let template =
`
<div>
  <div class="text-center" :if="title">
    <h3 :html="title"></h3>
  </div>
  <table class="table" :class="style">
    <thead>
    <tr>
      <th :for="col in columns" :css="{width:col.width}" :click="sort(col)">
        <span class="pull-right" :visible="col.sortOrder">
          <i :class="['icon-arrow-' + col.sortOrder]"></i>
        </span>
        {{col.title}}
      </th>
    </tr>
    </thead>
      <tbody>
        <tr :for="(rowIndex, item) in rows"
            :class="{'info':item.selected}" :click="toggleSelect(item)">
            <td :for="col in columns" :html="dealValue(item, col, rowIndex)"></td>
        </tr>
      </tbody>
  </table>
  <h2 class="muted text-center" :visible="!loading && rows.length === 0">暂无数据</h2>
  <ms-pagination :ref="pagination" />
</div>
`

let columnDefault = {//column基本属性
  field: '',//字段名
  title: '',//标题
  width: '',//列宽度
  sort: false,//排序
  sortOrder: '',
  sortFn: avalon.filters.orderBy,
  formatter: avalon.noop//格式化函数
}

let rowDefault = {//row基本属性
  selected: false
}

export default {
  name: 'ms-grid',
  template,
  data () {
    return {
      $lastSelect: null,//前一个选择
      $data: [],
      loading: true,
      page: 1,
      rows: []
    }
  },
  props: {
    title: '',
    style: ['table-striped', 'table-bordered', 'table-hover'],//表格样式
    columns: [],
    multiple: true,//是否允许多选
    pageSize: 5
  },
  beforeCreate () {
    for(let i = 0, len = this.columns.length, column; i < len; i++){
      column = this.columns[i]
      for(let key in columnDefault){
        if(column[key] === undefined){
          column[key] = columnDefault[key]
        }
      }
      if(column.formatter !== avalon.noop){
        if(column.formatter === 'datetime'){
          column.formatter = function(v){
            return avalon.filters.date(v,'yyyy-MM-dd HH:mm:ss')
          }
        }else if(column.formatter === 'date'){
          column.formatter = function(v){
            return avalon.filters.date(v,'yyyy-MM-dd')
          }
        }
      }
    }
  },
  methods: {
    dealValue (item, column, rowIndex){
      let value = item[column.field]
      if(column.formatter && column.formatter !== avalon.noop){
        return column.formatter(value, item, rowIndex)
      }
      if(value === null || value === undefined){
        return ''
      }
      return value
    },
    toggleSelect (item){
      if(this.multiple){
        item.selected = !item.selected
        item.selected && item.onSelect && this.onSelect(item.$model)
      }else{
        if(item.selected){
          item.selected = false
          this.$lastSelect = null
        }else{
          if(this.$lastSelect){
            this.$lastSelect.selected = false
          }
          item.selected = true
          this.$lastSelect = item
        }
      }
    },
    getSelected () {
      if(this.multiple){
        let selectd = []
        avalon.each(this.rows, (i, item) => {
          item.selected && selectd.push(item.$model)
        })
        return selectd
      }else{
        return this.$lastSelect ? this.$lastSelect.$model : ''
      }
    },
    extendRowsData (data, fields){//处理每一行数据
      let obj = avalon.mix({}, rowDefault)
      for(let i = 0, row; row = data[i]; i++){
        if(avalon.type(row) === 'array'){
          let r = {}
          avalon.each(row, function (i, v) {
            r[fields[i]] = v
          });
          data[i] = row = r
        }
        for(let j in obj){
          if(row[j] === undefined){
            row[j] = obj[j]
          }
        }
      }
      return data;
    },
    setData (data, append) {
      let fields = this.columns.map(function (item) {
        return item.field;
      });
      data = this.extendRowsData(data, fields)
      if (append) {
        Array.prototype.push.apply(this.$data, data)
      } else {
        this.$data = data
      }
      this.loading = false
      this.update()
    },
    sort (column){
      if(column.sort){
        let order
        avalon.each(this.columns, function (i, c) {
          c != column && (c.sortOrder = '')
        })
        if(column.sortOrder === 'down'){
          column.sortOrder = 'up'; order = 1
        }else{
          column.sortOrder = 'down'; order = -1
        }
        if(column.sortFn && column.sortFn !== avalon.noop){
          this.$data = column.sortFn(this.$data, column.field, order)
          if (this.page == 1) {
            this.update()
          } else {
            this.page = 1
          }
        }
      }
    },
    update () {
      let pagination = this.$$ref.pagination
      let page = this.page
      let pageSize = this.pageSize
      let len = this.$data.length
      let limit = Math.min(len, pageSize)
      let begin = (page - 1) * pageSize
      let rows = []
      for (let i = begin; i < len; i++) {
        if (rows.length === limit) {
          break;
        }
        rows.push(this.$data[i])
      }
      this.rows = rows
      pagination.currentPage = page
      pagination.totalPages = Math.ceil(len / pageSize)
    },
    onPageChange (evt, curPage) {
      this.page = curPage
    }
  },
  watch: {
    page (value) {
      value && this.update()
    },
    pageSize () {
      this.update()
    }
  },
  events: ['onSelect'],
  components: {
    Pagination
  }
}
