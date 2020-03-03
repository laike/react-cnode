## 关于 React-Cnode

使用 React Mobx Express Axios 打造的 cnnode 版本,此版本中没有发布话题以及文章评论功能，是 cnodejs.org 的 api 中移除了这部分 api，可能是官方担心有人，无节制乱发测试评论以及测试文章话题的原因。基本上官方提供的接口功能都有了，比如搜藏，取消搜藏，未读消息，已读消息，个人详情页面等。关于登录问题您需要在https://cnodejs.org 网站通过注册或者 github 第三方登录，到后台设置里面获取个人 Token 然后使用 Token 登录，比较麻烦因为官方没有提供第三方 Basic 认证或者 Auth 认证。

## 应用部分截图

<img src="https://windke.cn/Public/screenshot/react-cnode/1.jpg" width="200"/><img src="https://windke.cn/Public/screenshot/react-cnode/2.jpg" width="200"/><img  src="https://windke.cn/Public/screenshot/react-cnode/3.jpg" width="200"/><img src="https://windke.cn/Public/screenshot/react-cnode/4.jpg" width="200"/><img src="https://windke.cn/Public/screenshot/react-cnode/5.jpg" width="200"/><img src="https://windke.cn/Public/screenshot/react-cnode/6.jpg" width="200"/><img src="https://windke.cn/Public/screenshot/react-cnode/7.jpg" width="200"/>

## 关于作者

1. 技术博客地址：https://windke.cn/blog/index.html
2. github 地址 : https://github.com/laike
3. 反馈邮箱: 924462390@qq.com

## 用到的技术

项目用 mobx+react-mobx 作为状态管理的解决方案，而不是使用 redux+react-redux 主要是因为使用 redux 需要至少创建三个文件夹 reducers ，actions，store，有时候还会有 types 这么一个文件夹，对于 cnodejs 这个 api 不是很复杂的网站，我们就可以选择 mobx，mobx 也不仅仅限于小项目，大项目一样可用具体可以去看看官网 [https://mobx.js.org/README.html](https://mobx.js.org/README.html)
详细文档可在官网查看，mobx 使用的是最新 es 中的特性 Proxy 来实现属性监听，不用 DefineProperty 也算跟 Vue 一样放弃这种方式转向 Proxy 怀抱，项目中部分代码用到了 react 新版本的 Hooks 特性，详情可以看官网 [https://react.docschina.org/docs/hooks-intro.html](https://react.docschina.org/docs/hooks-intro.html)
简单的来说 Hooks 需要在纯函数组件中使用，Hooks 实现使用了 js 闭包的特性，所以在函数组件内可以直接访问变量操作 state，常用的 Hooks 有 useEffect useState useMemo useRef 这几个函数有两个是可以对应 react component 组件里面的生命周期方法的 useEffect(componentDidMount，componentDidUpdate 和 componentWillUnmount)
此项目也做了服务器端渲染 SSR，并且通过配置 webpack 让服务端代码可以使用 es6 进行编写，关于服务器端渲染可以看官方文档,基本方法就是 react-dom/server 下面的 renderToString 这个方法，然后服务器端获取数据方式通过给组件配置 loadData 方法获取到数据后然后输出到 html 中完成数据预渲染。
为了做到浏览器端登录和 ssr 方式访问登录信息共用并且使得 session 持久化，用到了 session-file-store 这个中间件，使得服务器端重启以后 session 也能够保存起来，在正式环境中还是建议切换到 redis 或者 mongodb 这种中间件来做 session 持久化操作
项目使用了第三方 ui 库 material-ui 作为样式以及布局，关于详细信息可以官方查看，
[https://material-ui.com/](https://material-ui.com/)
项目中还是用了 Axios 这个网络请求库，这个库可以做请求和响应的拦截，方便于后期封装，我的另一个 react native 的项目[https://github.com/laike/rn-github](https://github.com/laike/rn-github) 就对库进行了封装，想了解的可以点击看看，具体位置在 src/untils/http.js 文件里面。

**以上是项目主要技术部分**

## 用到的第三方框架

       @material-ui/core
        @material-ui/icons

        axios

        highlight.js

        lodash

        markdown-it

        mobx

        mobx-react

        moment

        nedb-session-store

        react-helmet

        serialize-javascript

        session-file-store

        typeface-roboto

## 关于编译相关问题

### 解决 Warning: Expected server HTML to contain a matching in

`const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate`

### Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.

解决方案：
`<Typography><p>最近没有发布的新话题</p></Typography>`
删除 Typography 组件里面的 p 标签

### 开发中遇到热更新 需要刷新整个页面的问题主要是 因为热更新的 json 文件没有成功获取，最后

检查发现是因为 output 的路径没有写对
output: {
path: path.join(**dirname, '../dist/'),
publicPath: '/public/'
},
原来是
output: {
path: path.join(**dirname, '../dist/'),
publicPath: '/public'
},
少了一个 / 结果大不相同，特别注意这个 output 的 publicPath 需要和 devServer 配置中的 publicPath 一致否则无法热更新。

### Vscode 下面 prettie 不起作用的问题

解决方法
需要当前项目下进行 npm 安装相关库 prettie 配合 eslint 对项目代码进行规范，统一团队写代码方式

`npm install -D prettier-eslint prettier eslint`

就解决 VScode 下面无法自动格式化代码，控制台报错的问题。

### 配置 eslintrc.js 的时候出现这种错误 Parsing error: Unexpected character '@' eslint

可以安装 babel-eslint 来解决，同时配置 parser

### 遇到打包时候文件特别大，初略看了下大概有 18M 左右，想了 webpack 配置 vendor 的方法，也加入了各种优化参数，但是还是无法减少大小，最后我在想是不是 matiral ui 这个库的问题，通过查看官方文档上面的指南部分最小化打包文件大小的方案，果然豁然开朗，需要配置.bablerc 默认 matiral ui 是把整个顶层全部打包了。解决方案如下

`const plugins = [ [ 'babel-plugin-transform-imports', { '@material-ui/core': { // Use "transform: '@material-ui/core/${member}'," if your bundler does not support ES modules 'transform': '@material-ui/core/esm/${member}', 'preventFullImport': true }, '@material-ui/icons': { // Use "transform: '@material-ui/icons/${member}'," if your bundler does not support ES modules 'transform': '@material-ui/icons/esm/${member}', 'preventFullImport': true } } ] ]; module.exports = {plugins};`

详细请看官方文档： https://material-ui.com/zh/guides/minimizing-bundle-size/

### 还遇到了服务器端渲染不正常的问题，问题在 client 浏览器端文件夹里面用到了服务器端没有办法识别的东西比如路由拦截

解决办法单独为 ssr 端设置一个路由器配置文件

### 关于 express 端数据持久化的问题，因为 express session 每次会话完毕或者服务器端重启后就没有了用户又要重新登录，所以引出了 session 持久化

解决办法：可以选择 redis 或者 MongoDB 的中间件，来进行持久化存储。或者其他方案如下，如果真正上线服务，还是要用 redius
https://blog.csdn.net/chaoyangsun/article/details/79240888

### 关于打包后还是有 5M 左右大小

解决方案：把不是必须 dependence 的包 移动到 dev dependencies 探索 webpack 里面的更多优化配置。

### 关于某些安装包安装过慢的问题

1.使用淘宝镜像

2.科学上网

3.下载包到本地可以用迅雷等软件，然后修改 node_modules 包中的下载代码，然后开启本地 http-server ，修改到本地服务器地址。
