import React, { useEffect, useState, useMemo } from "react";
import PropTypes from "prop-types";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import Divider from "@material-ui/core/Divider";
import ListItemText from "@material-ui/core/ListItemText";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Typography from "@material-ui/core/Typography";
import _ from "lodash";
const useStyles = makeStyles(theme => ({
  root: {
    padding: 10,
    backgroundColor: theme.palette.background.paper,
  },
  title: {
    padding: 10,
  },
}));

const MessageList = ({ appState }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <Typography variant="h6" className={classes.title}>
        过往信息
      </Typography>
      <List className={classes.root}>
        {appState.user.messages.list.has_read_messages ? (
          appState.user.messages.list.has_read_messages.map(message => {
            return (
              <div key={_.uniqueId()}>
                <ListItem alignItems="flex-start">
                  <ListItemText
                    primary={message.topic.title}
                    secondary={<React.Fragment>{`${message.author.loginname} 回复了您的话题 `}</React.Fragment>}
                  />
                </ListItem>
                <Divider variant="inset" component="li" />
              </div>
            );
          })
        ) : (
          <div>
            <Typography>还没有过往消息！</Typography>
          </div>
        )}
      </List>
    </div>
  );
};
export default MessageList;
