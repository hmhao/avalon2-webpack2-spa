let template = 
`
<div class="pagination text-center" style="display: none;" :visible="totalPages > 1">
  <ul>
    <li class="first" :visible="firstText" :class="{disabled: isDisabled('first', 1)}">
      <a :attr="{href: getHref('first'), title: '首页'}"
         :click="change($event, 'first')" :html="firstText">
      </a>
    </li>
    <li class="prev" :class="{disabled: isDisabled('prev', 1)}">
      <a :attr="{href: getHref('prev'), title: '上一页'}"
         :click="change($event, 'prev')" :html="prevText">
      </a>
    </li>
    <li :class="{active: currentPage == 1}">
      <a :attr="{href: getHref(1), title: '第1页'}"
         :click="change($event, 1)">1
      </a>
    </li>
    <li><span class="omit" :if="showFirstOmit">...</span></li>
    <li :for="page in pages" :class="{active: currentPage == page}">
      <a :attr="{href: getHref(page), title: '第'+page+'页'}"
         :click="change($event, page)">{{page}}
      </a>
    </li>
    <li><span class="omit" :if="showLastOmit">...</span></li>
    <li :class="{active: currentPage === totalPages}">
      <a :attr="{href: getHref(totalPages), title: '第'+totalPages+'页'}"
         :click="change($event, totalPages)">{{totalPages}}
      </a>
    </li>
    <li class="next" :class="{disabled: isDisabled('next', totalPages)}">
      <a :attr="{href: getHref('next'), title: '下一页'}"
         :click="change($event, 'next')" :html="nextText">
      </a>
    </li>
    <li class="last" :visible="firstText" :class="{disabled: isDisabled('last', totalPages)}">
      <a :attr="{href:getHref('last'), title: '末页'}"
         :click="change($event, 'last')" :html="lastText">
      </a>
    </li>
  </ul>
</div>
`
let rpage = /(?:&|\?)page=(\d+)/

export default {
  name: 'ms-pagination',
  template,
  data (){
    return {
      $disable:{},//存放first, last, prev, next的disabled状态
      pages: [],
      showFirstOmit: false,
      showLastOmit: false
    }
  },
  props: {
    showPages: 5,//要显示出来的页数
    totalPages: 1,//总页数
    currentPage: 1,//当前页
    align: -1,//对齐 -1:左 | 0:中 | 1:右
    firstText: '',
    prevText: '上一页',
    nextText: '下一页',
    lastText: '',
  },
  methods: {
    onInit (evt) {
      let cur = this.currentPage
      //直接从地址栏得到当前页参数
      let match = rpage.exec(document.location.href)
      if (match && match[1]) {
        cur = ~~match[1]
        if (cur <= 0) {
          cur = 1
        }
      }
      this.update(cur)
    },
    isDisabled (name, page) {
      return this.$disable[name] = (this.currentPage === page);
    },
    toPage (p) {
      let cur = this.currentPage
      let max = this.totalPages
      switch (p) {
        case 'first':
          return 1
        case 'prev':
          return Math.max(cur - 1, 1)
        case 'next':
          return Math.min(cur + 1, max)
        case 'last':
          return max
        default:
          return p
      }
    },
    getPages (currentPage) {//中间显示页数的计算
      let pages = []
      let total = this.totalPages
      let s = this.showPages
      let start = currentPage
      let end = currentPage

      if (total <= s) {//总页数少于显示页数时有多少页显示多少页
        for (var i = 2; i <= total - 1; i++) {
          pages.push(i)
        }
      } else {
        if(currentPage > 1 && currentPage < total){
          pages.push(currentPage)
        }
        s = s - 2//减去首尾两个
        while (true) {
          if (pages.length >= s) {
            break
          }
          if (start > 2) {
            pages.unshift(--start)
          }
          if (pages.length >= s) {
            break
          }
          if (end < total - 1) {
            pages.push(++end)
          }
        }
      }

      return {currentPage: currentPage, pages: pages}
    },
    getHref (page) {
      return 'javascript:void(0)'
      page = this.toPage(page)

      let href = document.location.href
      if (rpage.test(href)) {
        href = href.replace(rpage, function(match, $1){
          return match.replace($1, page)
        })
      } else {
        href += (href.indexOf('?') > -1 ? '&' : '?') + 'page=' + this.toPage(page)
      }
      return href
    },
    update (cur) {/*更新页码*/
      let obj = this.getPages(cur)
      this.currentPage = obj.currentPage
      this.pages = obj.pages
      this.showFirstOmit = obj.pages[0] > 2
      this.showLastOmit = obj.pages[obj.pages.length - 1] < this.totalPages - 1
    },
    change (evt, p) {
      let cur = this.toPage(p)
      if (this.$disable[p] || p === this.currentPage) {
        evt.preventDefault()
        return //disabled, active不会触发
      }
      this.update(cur)
      this.onPageChange && this.onPageChange(evt, this.currentPage)
    }
  },
  watch: {
    totalPages () {
      this.update(this.currentPage)
    }
  },
  events: ['onPageChange']// 组件对外分发事件的声明,让用户重写
}
