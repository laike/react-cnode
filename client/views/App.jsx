import React from "react";
import { Switch, Route } from "react-router-dom";
import _ from "lodash";
import routes from "../config/router";
import AppBar from "./layout/app-bar";
import BottomBar from "./layout/bottom-bar";

const App = () => {
  React.useEffect(() => {
    //这里是用于Matiral UI的服务器端渲染
    const jssStyles = document.querySelector("#jss-server-side");
    if (jssStyles) {
      jssStyles.parentElement.removeChild(jssStyles);
    }
  });

  return [
    <Route key="top" component={AppBar} />,
    <Switch>{routes.map(route => route)}</Switch>,
    <Route key="btotom" component={BottomBar} />,
  ];
};

export default App;
