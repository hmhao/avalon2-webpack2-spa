import Router from './base'
import IndexPanel from '../page/IndexPanel'
import ListPanel from '../page/ListPanel'
import GridPanel from '../page/GridPanel'
import DropdownPanel from '../page/DropdownPanel'
import TabsPanel from '../page/TabsPanel'
import AccordionPanel from '../page/AccordionPanel'
import TooltipPanel from '../page/TooltipPanel'
import DatepickerPanel from '../page/DatepickerPanel'
import TreePanel from '../page/TreePanel'
import CarouselPanel from '../page/CarouselPanel'

import RouterPanel from '../page/RouterPanel'
import Foo from '../page/router/Foo'
import Bar from '../page/router/Bar'
import Baz from '../page/router/Baz'

export default new Router({
  routes: [
    {
      path: ['/', '/#'],
      redirect: '//index' //必须使用双斜杠,mmRouter的urlFormate过滤掉第一个斜杠
    },
    {
      path: '/index',
      title: '首页',
      component: IndexPanel
    },
    {
      path: '/list',
      title: '列表',
      component: ListPanel
    },
    {
      path: '/grid',
      title: '表格',
      component: GridPanel
    },
    {
      path: '/dropdown',
      title: '下拉菜单',
      component: DropdownPanel
    },
    {
      path: '/tabs',
      title: '标签卡',
      component: TabsPanel
    },
    {
      path: '/accordion',
      title: '手风琴',
      component: AccordionPanel
    },
    {
      path: '/tooltip',
      title: '提示工具',
      component: TooltipPanel
    },
    {
      path: '/datepicker',
      title: '日期选择',
      component: DatepickerPanel
    },
    {
      path: '/tree',
      title: '树组件',
      component: TreePanel
    },
    {
      path: '/carousel',
      title: '轮播',
      component: CarouselPanel
    },
    {
      path: '/router',
      title: '嵌套路由',
      component: RouterPanel,
      children: [
        { 
          path: 'foo', 
          component: Foo 
        },
        { 
          path: 'bar', 
          component: Bar,  
          children: [
            { 
              path: 'baz', 
              component: Baz 
            }
          ]
        }
      ]
    }
  ]
})
