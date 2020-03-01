const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const serialize = require('serialize-javascript')
const path = require('path')
const proxy = require('http-proxy-middleware')
const reactTreeWalker = require('react-tree-walker')
const ReactSSR = require('react-dom/server')
const NativeModule = require('module')
const vm = require('vm')
const ejs = require('ejs')
const serverConfig = require('../../build/webpack.config.server')
// const routes = require('../../client/config/router')
const getModuleFromString = (bundle, filename) => {
  // 在这里进行操作
  const m = { exports: {} }
  const wrapper = NativeModule.wrap(bundle)
  const script = new vm.Script(wrapper, {
    filename: filename,
    displayErrors: true
  })
  const result = script.runInThisContext()
  result.call(m.exports, m.exports, require, m)
  return m
}

const getStoreState = (stores) => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName]
    return result
  }, {})
}

const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:8888/public/server.ejs')
      .then(res => {
        resolve(res.data)
      })
      .catch(reject)
  }).catch(err => console.log(err))
}

const serverCompiler = webpack(serverConfig)
const mfs = new MemoryFs()
serverCompiler.outputFileSystem = mfs
let serverBundle, createStoreMaps
serverCompiler.watch({}, (err, stats) => {
  if (err) throw err
  stats = stats.toJson()
  stats.errors.forEach(err => console.log(err))
  stats.warnings.forEach(warn => console.log(warn))

  const bundlePath = path.join(
    serverConfig.output.path,
    serverConfig.output.filename
  )
  const bundle = mfs.readFileSync(bundlePath, 'utf-8')
  const m = getModuleFromString(bundle, 'server-entry.js')
  console.log(m.exports)
  serverBundle = m.exports.default
  createStoreMaps = m.exports.CreateStateMaps
})

const asyncFetchData = async (App) => {
  const promises = []

  const visitor = (element, instance) => {
    if (instance && typeof instance.fetchData === 'function') {
      promises.push(instance.fetchData())
    }
  }

  await reactTreeWalker(App, visitor)

  return Promise.all(promises)
}
module.exports = function (app) {
  app.use('/public', proxy({
    target: 'http://localhost:8888'
  }))
  app.get('*', function (req, res, next) {
    if (!serverBundle) {
      res.send('server bundle is waiting ...')
      return
    }
    getTemplate().then(template => {
      const routerContext = {}
      const stores = createStoreMaps()
      const appContext = serverBundle(stores, routerContext, req.path)
      asyncFetchData(appContext).then(() => {
        console.log('ok...')
      })
      if (routerContext.url) {
        res.status(302).setHeader('Location', routerContext.url)
        res.end()
      }
      const state = getStoreState(stores)
      // 如果我们能够拿到异步数据 如果访问login就拿login组件的异步数据
      const content = ReactSSR.renderToString(appContext)
      // res.send(template.replace('<!-- app -->', content))
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state)
      })
      res.send(html)
    }).catch(next)
  })
}
