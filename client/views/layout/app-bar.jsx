/* eslint-disable react/self-closing-comp */
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { inject, observer } from "mobx-react";
import { withStyles } from "@material-ui/core/styles";
import Grid from "@material-ui/core/Grid";
import { AppBar, Toolbar, Button, IconButton, Typography } from "@material-ui/core";

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

  render() {
    const { classes, appState, history } = this.props;
    let { user } = appState;
    return (
      <div className={classes.root}>
        <AppBar position="fixed">
          <Toolbar>
            <Grid container>
              <Grid item xs={10}>
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
              <Grid item xs={2}>
                <Button
                  color="secondary"
                  variant="text"
                  onClick={() => {
                    console.log(user);
                    return;
                    history.push("/create/topic");
                  }}>
                  新建话题
                </Button>

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
