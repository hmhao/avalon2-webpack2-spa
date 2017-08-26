# avalon2-webpack2-spa
>该项目不直接修改avalon2源码，只是在其基础上扩展。[演示地址](https://hmhao.github.io/avalon2-webpack2-spa/)，**[详细说明](https://github.com/hmhao/avalon2-webpack2-spa/wiki)**

## 说明
* 整合avalon2和webpack2，支持webpack热更新
* 兼容性支持IE8以下，IE8以下禁用热更新，需要手动刷新
* [采用ES6、类vue的单文件组件书写](#component)
（avalon组件只使用defaults来定义组件VM的属性与方法，在书写时非常混乱）
* 加入官网路由并改造，实现嵌套路由(使用[ms-router-link](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/link.js)和[ms-router-view](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/base/components/view.js))，支持路由懒加载([参考](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/index.js))
* 加入cookie_js、[avalonx](https://github.com/hmhao/avalonx)(状态管理)
* 增加ref指令，父组件可通过$$ref引用子组件
* 提供组件指令placeholder、tooltip、datepicker
* 提供基于Bootstrap2的基础组件Accordion、Alert、Carousel、Datepicker、Dropdown、Grid、Modal、Pagination、Panel、Tabs、Tree、Typeahead（后续待补充其他）。使用方法查看 **[WIKI](https://github.com/hmhao/avalon2-webpack2-spa/wiki/%E7%BB%84%E4%BB%B6)**

## [路由书写及使用](https://github.com/hmhao/avalon2-webpack2-spa/wiki/%E8%B7%AF%E7%94%B1)
* 路由书写参考例子：[router](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/router/index.js)
* 路由使用参考例子：[Nav](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/Nav.js)

## [组件书写及使用](https://github.com/hmhao/avalon2-webpack2-spa/wiki/%E7%BB%84%E4%BB%B6)
* 组件书写参考例子：[Login](https://github.com/hmhao/avalon2-webpack2-spa/blob/master/src/components/dialog/Login.js)

## 使用
| 命令             | 说明                         |
| ---------------- | ---------------------------- |
| npm run dev      | 开发模式运行项目（带热更新） |
| npm run build    | 构建生产环境代码             |
