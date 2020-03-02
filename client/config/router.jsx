import React from "react";
import { Route, Redirect, withRouter } from "react-router-dom";
import TopicList from "../views/topic-list/index";

import TopicDetail from "../views/topic-detail/index";

import ApiTest from "../views/test/api-test";

import CreateTopic from "../views/create/index";

import Login from "../views/user/login";

import NotFound from "../views/NotFound";

import Message from "../views/message/index";

import UserInfo from "../views/user/info";
import { observer, inject } from "mobx-react";
import PropTypes from "prop-types";
//这里我们要创建一个HOC组件用来拦截用户是否登录
const AuthorizationComponent = ({ isLogin = true, Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props => {
        if (isLogin) {
          return <Component {...props} />;
        } else {
          return (
            <Redirect
              to={{
                pathname: "/user/login",
                search: `?from=${rest.path}`,
              }}
            />
          );
        }
      }}
    />
  );
};

const ConnnectAuthorizationComponent = withRouter(
  inject(stores => {
    return {
      isLogin: stores.appState.user.isLogin,
    };
  })(observer(AuthorizationComponent)),
);

AuthorizationComponent.propTypes = {
  isLogin: PropTypes.bool,
};

//有三个页面设置为true 表示不用登录即可查看
const routes = [
  <Route component={TopicList} key={"index"} path="/" exact={true} loadData={TopicList.loadData} />,
  <Route component={TopicList} path="/list/:tab" key={"listtab"} loadData={TopicList.loadData} />,
  <Route component={TopicDetail} path="/detail/:id" key="detail" loadData={TopicDetail.loadData} />,
  <Route component={ApiTest} path="/test" key="test" />,
  <Route component={Login} path="/user/login" key="login" />,
  <ConnnectAuthorizationComponent Component={UserInfo} path="/user/info" key="userinfo" />,
  <ConnnectAuthorizationComponent Component={CreateTopic} path="/create/topic" key="CreateTopic" />,
  <ConnnectAuthorizationComponent Component={Message} path="/message/info" key="message" />,
  // {
  //   component: NotFound
  // }
];

export default routes;
