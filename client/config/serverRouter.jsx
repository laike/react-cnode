import React from "react";

import { Route, Redirect } from "react-router-dom";
import TopicList from "../views/topic-list/index";

import TopicDetail from "../views/topic-detail/index";

import ApiTest from "../views/test/api-test";

import CreateTopic from "../views/create/index";

import Login from "../views/user/login";

import NotFound from "../views/NotFound";

import UserInfo from "../views/user/info";

const routes = [
  {
    path: "/",
    exact: true,
    component: TopicList,
    loadData: TopicList.loadData,
  },
  {
    path: "/first/:tab",
    key: "first",
    component: TopicList,
    loadData: TopicList.loadData,
  },
  {
    path: "/list/:tab",
    component: TopicList,
    key: "list",
    loadData: TopicList.loadData,
  },
  {
    path: "/detail/:id",
    component: TopicDetail,
    key: "detail",
    loadData: TopicDetail.loadData,
  },
  {
    path: "/test",
    component: ApiTest,
    key: "test",
  },
  {
    path: "/user/login",
    component: Login,
    key: "login",
  },
  {
    path: "/user/info",
    component: UserInfo,
    key: "userinfo",
  },
  {
    path: "/create/topic",
    component: CreateTopic,
    key: "createtopic",
  },
  // {
  //   component: NotFound
  // }
];

export default routes;
