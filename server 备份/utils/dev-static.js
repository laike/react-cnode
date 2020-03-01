const axios = require('axios')
const webpack = require('webpack')
const MemoryFs = require('memory-fs')
const serialize = require('serialize-javascript')
const path = require('path')
const proxy = require('http-proxy-middleware')
const asyncBootstrap = require('react-async-bootstrapper')
const ReactSSR = require('react-dom/server')
const NativeModule = require('module')
const vm = require('vm')
const ejs = require('ejs')
const serverConfig = require('../../build/webpack.config.server')
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
    result[storeName] = stores[storeName].toJson()
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
      asyncBootstrap(appContext).then(() => {
        console.warn('asyncbootstrap...')
        if (routerContext.url) {
          res.status(302).setHeader('Location', routerContext.url)
          res.end()
          return
        }
        const state = getStoreState(stores)
        const content = ReactSSR.renderToString(appContext)
        // res.send(template.replace('<!-- app -->', content))
        const html = ejs.render(template, {
          appString: content,
          initialState: serialize(state)
        })
        res.send(html)
      }).catch(next)
    }).catch(next)
  })
}
