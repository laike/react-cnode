const path = require('path')
const express = require('express')
const fs = require('fs')
const ReactSSR = require('react-dom/server')
// 引入express session
const session = require('express-session')
const bodyParser = require('body-parser')
// const query = require('query-string')
// const React2 = require('react')
// var React1 = null
// require('react-dom')
// console.log(React1 === React2)
const isDev = process.env.NODE_ENV === 'development'
const favicon = require('serve-favicon')
const app = express()
// 调试错误原因
process.on('unhandledRejection', (reason, p) => {
  console.log('Unhandled Rejection at: Promise', p, 'reason:', reason)
  // application specific logging, throwing an error, or other logic here
})

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(session({
  maxAge: 10 * 60 * 1000,
  name: 'tid',
  resave: false,
  saveUninitialized: false,
  secret: 'react cnode class'
}))
app.use(favicon(path.join(__dirname, 'favicon.ico')))
// 需要在服务器段渲染之前

app.use('/api/user', require('./utils/handle-login'))

app.use('/api', require('./utils/proxy'))

if (!isDev) {
  const serverEntry = require('../dist/server-entry.js').default
  const template = fs.readFileSync(path.join(__dirname, '../dist/index.html'), 'utf-8')
  app.use('/public', express.static(path.join(__dirname, '../dist')))
  app.get('*', function (req, res) {
    const appString = ReactSSR.renderToString(serverEntry)

    res.send(template.replace('<!-- app -->', appString))
  }
  )
} else {
  // excute another mode

  const devStatic = require('./utils/dev-static.js')
  devStatic(app)
}
const host = process.env.HOST || 'localhost' // 还可以默认是0.0.0.0 回环地址
const port = process.env.PORT || 3333

app.listen(port, host, function () {
  console.log(`react ssr is starting listen at ${host}:${port} port`)
})
