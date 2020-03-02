/* eslint-disable react/self-closing-comp */
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@material-ui/core";
import Badge from "@material-ui/core/Badge";
import MailIcon from "@material-ui/icons/Mail";
import { Home } from "@material-ui/icons";
import { Link } from "react-router-dom";

const styles = {
  root: {
    width: "100%",
    flexDirection: "row",
  },
  flex: {
    flex: 1,
  },
  createTopicBtn: {
    backgroundColor: "blue",
  },
};
@inject(stores => {
  return {
    appState: stores.appState,
  };
})
@observer
class MaiAppBar extends React.Component {
  // eslint-disable-next-line react/static-property-placement
  static contextTypes = {
    router: PropTypes.object,
  };

  // eslint-disable-next-line class-methods-use-this
  onCreateClick() {}

  componentDidMount() {
    const { appState } = this.props;
    //调用api
    appState.getMessagesAcount().then(res => {
      //console.log(res);
    });
    //同时获取当前登录用户的信息
    appState.getUserInfo(appState.user.info.loginname).then(res => {
      console.log(res);
    });
    console.log("msssage list ", appState.user.messages);
  }
  render() {
    const { classes, appState, history } = this.props;
    let { user, messagesAcount } = appState;
    console.log(user);
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Grid container>
              <Grid item xs={9}>
                <IconButton
                  color="secondary"
                  onClick={() => {
                    history.push("/");
                  }}>
                  <Home />
                </IconButton>
                <Button
                  variant="text"
                  color="secondary"
                  component={"span"}
                  onClick={() => {
                    history.push("/");
                  }}>
                  CNode
                </Button>
              </Grid>
              <Grid item xs={3}>
                <Button
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    history.push("/message/info");
                  }}>
                  未读消息
                </Button>
                <Badge badgeContent={messagesAcount ? messagesAcount : 0} color="secondary">
                  <MailIcon color="secondary" />
                </Badge>
                {user.isLogin ? (
                  <Button
                    color="secondary"
                    onClick={() => {
                      history.push("/user/info");
                    }}>
                    {user.info.loginname}
                  </Button>
                ) : (
                  <Button
                    color="secondary"
                    onClick={() => {
                      console.log(this.context);
                      history.push("/user/login");
                    }}>
                    登陆
                  </Button>
                )}
              </Grid>
            </Grid>
          </Toolbar>
        </AppBar>
      </div>
    );
  }
}

MaiAppBar.propTypes = {
  classes: PropTypes.object.isRequired,
};
MaiAppBar.wrappedComponent.propTypes = {
  appState: PropTypes.object.isRequired,
};

export default withStyles(styles)(MaiAppBar);
