import React from "react";
import path from "path";
import Helmet from "react-helmet";
import express from "express"; //eslint-disable-line
// 服务器端路由渲染
import { StaticRouter, Route, matchPath, Switch } from "react-router-dom";
import { matchRoutes } from "react-router-config";
import ReactSSR from "react-dom/server";
import session from "express-session";
import bodyParser from "body-parser";
import favicon from "serve-favicon";
import ejs from "ejs";
import serialize from "serialize-javascript";
import proxy from "http-proxy-middleware"; //eslint-disable-line
import axios from "axios";
import { Provider, useStaticRendering } from "mobx-react";
import { ServerStyleSheets, ThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { lightBlue, pink } from "@material-ui/core/colors";
import { CreateStateMaps } from "./store/store";
import routes from "./config/serverRouter";
import AppBar from "./views/layout/app-bar";
import BottomBar from "./views/layout/bottom-bar";
import _ from "lodash";
//用于session持久化的库
import FileStore from "session-file-store";
const FileStoreSession = FileStore(session);
// 创建 session 中间件
const sessionMiddleware = session({
  store: new FileStoreSession(), //数据持久化方式，这里表示本地文件存储
  secret: "windke", //加密key 可以随意书写
  cookie: { maxAge: 60000 }, //两次请求的时间差 即超过这个时间再去访问 session就会失效
});
const app = express();
const isDev = process.env.NODE_ENV === "development";

const getStoreState = stores => {
  return Object.keys(stores).reduce((result, storeName) => {
    result[storeName] = stores[storeName].toJson();
    return result;
  }, {});
};
const getTemplate = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("http://localhost:8888/public/server.ejs")
      .then(res => {
        resolve(res.data);
      })
      .catch(reject);
  }).catch(err => console.log(err));
};
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  sessionMiddleware, //注入中间件
);
// app.use(favicon(path.join(__dirname, 'favicon.ico')))

app.use("/api/user", require("../server/utils/handle-login"));

app.use("/api", require("../server/utils/proxy"));

const theme = createMuiTheme({
  palette: {
    primary: lightBlue,
    accept: pink,
    type: "light",
  },
});

// start static rendering
useStaticRendering(true);
const sheets = new ServerStyleSheets();
// 调试错误原因
process.on("unhandledRejection", (reason, p) => {
  console.log("Unhandled Rejection at: Promise", p, "reason:", reason);
  // application specific logging, throwing an error, or other logic here
});
const serverBundle = (stores, routerContext, url) =>
  sheets.collect(
    <Provider {...stores}>
      <StaticRouter context={routerContext} location={url}>
        <ThemeProvider theme={theme}>
          <AppBar />
          <Switch>
            {routes.map(route => (
              <Route {...route} key={_.uniqueId()} />
            ))}
          </Switch>
          <BottomBar />
        </ThemeProvider>
      </StaticRouter>
    </Provider>,
  );

function render(stores, req, res, next, context) {
  getTemplate()
    .then(template => {
      const appContext = serverBundle(stores, context, req.path);
      // bootstrapper(appContext).then(() => {
      //   console.log('ok')
      // })
      const helmet = Helmet.rewind();
      if (context.url) {
        res.status(302).setHeader("Location", context.url);
        res.end();
      }
      const state = getStoreState(stores);
      const content = ReactSSR.renderToString(appContext);
      const html = ejs.render(template, {
        appString: content,
        initialState: serialize(state),
        style: helmet.style.toString(),
        meta: helmet.meta.toString(),
        link: helmet.link.toString(),
        title: helmet.title.toString(),
        materialCss: sheets.toString(),
      });

      if (context.NOT_FOUND) {
        res.status(404).send(html);
      } else {
        res.send(html);
      }
    })
    .catch(next);
}

app.use(
  "/public",
  proxy({
    target: "http://localhost:8888",
  }),
);
app.use("/dev", express.static("dev"));
app.get("*", (req, res, next) => {
  const stores = CreateStateMaps();
  if (req.session.user) {
    stores.appState.user.isLogin = true;
    stores.appState.user.info = req.session.user;
  }
  // 在这里进行异步加载数据
  const promises = [];
  const matchedRoutes = matchRoutes(routes, req.path);
  matchedRoutes.forEach(item => {
    if (item.route.loadData) {
      promises.push(item.route.loadData(stores, item.match.params));
    }
  });
  Promise.all(promises).then(item => {
    const context = {};
    render(stores, req, res, next, context);
  });
});

const host = process.env.HOST || "localhost"; // 还可以默认是0.0.0.0 回环地址
const port = process.env.PORT || 3333;

app.listen(port, host, () => {
  console.log(`react ssr is starting listen at ${host}:${port} port`);
});
