import React, { useEffect, useState, useMemo } from "react";
import { Helmet } from "react-helmet";
import { Grid } from "@material-ui/core";
import { inject, observer } from "mobx-react";

import { withStyles } from "@material-ui/core/styles";
import Container from "../layout/container";
//引入小组件
import MessagePage from "./message";
import OldMessagePage from "./oldmessage";
import UserPanel from "./userpanel";

const Message = props => {
  const { appState } = props;
  useEffect(() => {
    appState
      .getMessages()
      .then(res => {
        console.log(res);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  return (
    <Container>
      <Helmet>
        <title>消息中心 </title>
        <meta name="description" content="this is description" />
      </Helmet>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <MessagePage {...props} />
          <OldMessagePage {...props} />
        </Grid>
        <Grid item xs={12} sm={6}>
          <UserPanel {...props} />
        </Grid>
      </Grid>
    </Container>
  );
};

const InjectedMessage = inject(stores => {
  return {
    appState: stores.appState,
  };
})(observer(Message));

export default InjectedMessage;
