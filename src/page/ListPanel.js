import Panel from '@/components/base/Panel'
import Pagination from '@/components/base/Pagination'

let template = 
`
<ms-panel :widget="{title: '列表'}">
  <div slot="panel-bar">
    <div class="row">
      <div class="span3">
        <div class="input-prepend">
          <span class="add-on">排序</span>
          <select class="span2" :duplex="video.sort">
            <option :for="sort in video.$sort" :attr="{value: sort.key}">{{sort.text}}</option>
          </select>
        </div>
      </div>
      <div class="span3">
        <div class="input-prepend">
          <span class="add-on">过滤</span>
          <select class="span2" :duplex-number="video.filter">
            <option :for="filter in video.$filter" :attr="{value: filter.value}">{{filter.text}}</option>
          </select>
        </div>
      </div>
      <div class="btn-group pull-right">
        
      </div>
    </div>
  </div>
  <table class="table table-bordered" slot="panel-table">
    <thead>
      <tr class="text-center">
        <td><input type="checkbox" :attr="{checked: allChecked}" :click="checkAll"/></td>
        <td>列表</td>
        <td>状态</td>
        <td>热度</td>
        <td>操作</td>
      </tr>
    </thead>
    <tbody>
      <tr :for="(i, v) in list">
        <td>
          <input type="checkbox" :attr="{checked: v.checked}" :click="checkOne($event, v)"/>
        </td>
        <td style="width: 60%">
          <div class="media">
            <a class="pull-left" href="javascript:void(0)">
              <img class="media-object" style="width: 138px; height: 78px;" :attr="{src: v.poster}">
            </a>
            <div class="media-body text-left">
              <dl>
                <dt :attr="{title: v.title}">{{v.title}}</dt>
                <dd>{{v.create_time}}</dd>
              </dl>
            </div>
          </div>
        </td>
        <td>
          <p>{{v.status | statusMsg}}</p>
        </td>
        <td>
          <p><i class="glyphicon glyphicon-expand"></i>{{v.plays}}</p>
          <p><i class="glyphicon glyphicon-comment"></i>{{v.comments}}</p>
        </td>
        <td>
          <p><a href="javascript:void(0)" :click="edit">编辑</a></p>
          <p><a href="javascript:void(0)" :click="remove">删除</a></p>
        </td>
      </tr>
    </tbody>
  </table>
  <ms-pagination :ref="pagination" slot="panel-footer"></ms-pagination>
</ms-panel>
`

let STATUS = {
  1: '上传',
  2: '审核',
  3: '发行'
}

export default {
  name: 'ms-list',
  template,
  data () {
    return {
      allChecked: false,
      list: []
    }
  },
  computed: {
    ...avalon.store.mapState(['video']),
  },
  methods: {
    ...avalon.store.mapActions(['getVideoList']),
    onReady () {
      this.getVideoList().done((result) => {
        if(result && result.status == 200){
          this.video.page = 1
        }
      })
    },
    onDispose () {
      this.video.page = -1
    },
    checkAll (evt) {
      let checked = this.allChecked = !this.allChecked
      this.list.forEach(function(item) {
        item.checked = checked
      })
    },
    checkOne (evt, video) {
      let checked = video.checked = !video.checked
      if (checked === false) {
        this.allChecked = false
      } else {//avalon已经为数组添加了ecma262v5的一些新方法
        this.allChecked = this.list.every(function (item) {
          return item.checked
        })
      }
    },
    update () {
      let video = this.video
      let page = video.page
      let sort = video.sort
      let filter = video.filter
      let arr = []
      avalon.each(video.$list, (i, item) => {
        if(!filter || item.status == filter)
          arr.push(item)
      })
      arr.sort((a, b) => {
        if(sort == 'new'){
          return new Date(a.create_time) < new Date(b.create_time) ? 1 : -1
        }else if(sort == 'hot'){
          return parseInt(a.plays) < parseInt(b.plays) ? 1 : -1
        }else{
          return a.id < b.id ? 1 : -1
        }
      })
      let len = arr.length
      let limit = Math.min(len, video.$perNum)
      let begin = (page - 1) * video.$perNum
      let list = []
      for (let i = begin; i < len; i++) {
        if (list.length === limit) {
          break;
        }
        list.push(arr[i])
      }
      this.list = list
      let pagination = this.$$ref.pagination
      pagination.currentPage = page
      pagination.totalPages = Math.ceil(len / video.$perNum)
    },
    edit () {

    },
    remove () {

    },
    onPageChange (evt, curPage) {
      this.video.page = curPage
    }
  },
  watch: {
    'video.page' (value) {
      value && this.update()
    },
    'video.sort' (value) {
      this.video.page = 1
      this.update()
    },
    'video.filter' (value) {
      this.video.page = 1
      this.update()
    }
  },
  filters: {
    statusMsg (status) {
      return STATUS[status] || '未知错误'
    }
  },
  components: {
    Panel,
    Pagination
  }
}
