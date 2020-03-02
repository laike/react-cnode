import React from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";
import routes from "../config/router";
import AppBar from "./layout/app-bar";
import BottomBar from "./layout/bottom-bar";
import { DEBUG_MODE } from "../config/config";
import Stats from "stats.js";

const App = () => {
  React.useEffect(() => {
    //这里是用于Matiral UI的服务器端渲染
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
    if (DEBUG_MODE) {
      var stats = new Stats();
      stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
      document.body.appendChild(stats.dom);

      function animate() {
        stats.begin();
        // monitored code goes here

        stats.end();

        requestAnimationFrame(animate);
      }

      requestAnimationFrame(animate);
    }
  });

  return [
    <Route key="top" component={AppBar} />,
    <Switch>{routes.map(route => route)}</Switch>,
    <Route key="btotom" component={BottomBar} />,
  ];
};

export default App;
