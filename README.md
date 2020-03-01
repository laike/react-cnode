# react-cnode

使用 React Mobox Express Axios 打造的 cnnode 版本

# 解决 Warning: Expected server HTML to contain a matching in

`const renderMethod = module.hot ? ReactDom.render : ReactDom.hydrate`

# Warning: validateDOMNesting(...): <p> cannot appear as a descendant of <p>.

解决方案：
<Typography>

<p>最近没有发布的新话题</p>
</Typography>
删除Typography组件里面的p标签

# 开发中遇到热更新 需要刷新整个页面的问题主要是 因为热更新的 json 文件没有成功获取，最后

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

# Vscode 下面 prettie 不起作用的问题

解决方法
需要当前项目下进行 npm 安装相关库 prettie 配合 eslint 对项目代码进行规范，统一团队写代码方式

`npm install -D prettier-eslint prettier eslint`

就解决 VScode 下面无法自动格式化代码，控制台报错的问题。

# 配置 eslintrc.js 的时候出现这种错误 Parsing error: Unexpected character '@' eslint

可以安装 babel-eslint 来解决，同时配置 parser
