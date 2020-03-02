import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import { Helmet } from "react-helmet";

import AppState from "../../store/app-state";

import Container from "../layout/container";
// 引入login 和 user 两个组件 根据登录状态进行切换
import Login from "./login";

@inject(stores => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  };
})
@observer
export default class User extends React.Component {
  constructor() {
    super();
    // this.state = {
    //   accesstoken: '',
    //   helpText: ''
    // }
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
  }

  componentDidMount() {
    // dosomething here
    const { user, history } = this.props;
    if (user.isLogin) {
      history.replace("/user/info");
    }
  }

  handleInput() {}

  handleLogin() {}

  asyncBootstrap() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.props.appState = {};
        resolve(true);
      });
    });
  }

  render() {
    const { user } = this.props;
    return (
      <Container>
        <Helmet>
          <title>登陆 </title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Login />
      </Container>
    );
  }
}

User.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState),
  user: PropTypes.object.isRequired,
};

User.propTypes = {
  history: PropTypes.object.isRequired,
};
