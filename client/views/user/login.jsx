import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import { Avatar, Typography, TextField, Button, Paper, Snackbar, IconButton, SnackbarContent } from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";
import { VerifiedUser as UserIcon, CheckCircle, Warning, Error, Info, Close, ArrowUpward } from "@material-ui/icons";

import { withStyles } from "@material-ui/core/styles";

import { Helmet } from "react-helmet";

import AppState from "../../store/app-state";

import { loginStyels } from "./styles/login";

import qs from "query-string";

// 引入login 和 user 两个组件 根据登录状态进行切换

@inject(stores => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  };
})
@observer
class Login extends React.Component {
  constructor() {
    super();
    this.state = {
      accesstoken: "",
      helpText: "",
      open: false,
      vertical: "top",
      horizontal: "center",
    };
    this.handleInput = this.handleInput.bind(this);
    this.handleLogin = this.handleLogin.bind(this);
    this.openMsgBox = this.openMsgBox.bind(this);
    this.closeMsgBox = this.closeMsgBox.bind(this);
  }

  componentDidMount() {
    // dosomething here
    const { user, history } = this.props;
    let from = history.location ? history.location.search.replace(/\?from=/gi, "") : "/";
    if (user.isLogin) {
      //已经登录那么就跳转
      history.replace(from);
      return;
    }
  }

  handleInput(event) {
    let { value } = event.target;
    if (value.trim() === "") {
      this.setState({ helpText: "必须输入accesstoken！" });
      return;
    }
    this.setState({
      accesstoken: value.trim(),
      helpText: "",
    });
  }

  handleLogin() {
    let { appState, history } = this.props;
    let { accesstoken } = this.state;
    if (accesstoken === "") {
      this.setState({
        helpText: "必须输入accesstoken！",
      });
      return;
    }
    // to Login
    this.setState({ helpText: "" });
    appState
      .login(accesstoken)
      .then(resp => {
        if (resp.success) {
          // login success
          history.replace("/user/info");
        } else {
          this.setState({
            helpText: "accesstoken错误！",
          });
          this.openMsgBox({});
        }
      })
      .catch(err => {
        console.log("err");
      });
  }

  openMsgBox(newState) {
    this.setState({ open: true, ...newState });
  }

  closeMsgBox() {
    this.setState({ open: false });
  }

  asyncBootstrap() {
    return new Promise(resolve => {
      setTimeout(() => {
        this.props.appState = {};
        resolve(true);
      });
    });
  }

  render() {
    let { user, classes } = this.props;
    let { helpText, accesstoken, vertical, horizontal, open } = this.state;
    return (
      <Paper className={classes.root}>
        <Helmet>
          <title>登陆 </title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Snackbar
          anchorOrigin={{ vertical, horizontal }}
          key={`${vertical},${horizontal}`}
          open={open}
          onClose={this.closeMsgBox}
          ContentProps={{
            "aria-describedby": "message-id",
          }}
          message={<span id="message-id">{helpText}</span>}
        />
        <div className={classes.bg}>
          {/* <Avatar src={user.author.avatar_url} /> */}
          <UserIcon />
          <Typography>未登录</Typography>
        </div>
        <div className={classes.loginBox}>
          <TextField
            onChange={this.handleInput}
            className={classes.loginTxt}
            placeholder="请输入AccessToken"
            defaultValue={accesstoken}
          />
          <Typography component={"span"} className={classes.error}>
            {helpText}{" "}
          </Typography>
          <Button onClick={this.handleLogin} variant="contained" color="secondary" className={classes.loginBtn}>
            登陆
          </Button>
        </div>
      </Paper>
    );
  }
}

Login.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState),
  user: PropTypes.object.isRequired,
};

Login.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(loginStyels)(Login);
