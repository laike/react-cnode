import React, { useState, useEffect } from "react";
import {
  ListItem,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
  Avatar,
  withStyles,
  makeStyles,
} from "@material-ui/core";
import dateFormat from "dateformat";
import { Home as HomeIcon } from "@material-ui/icons";
import PropTypes from "prop-types";
import cx from "classnames";
import ListItemSecondaryAction from "@material-ui/core/ListItemSecondaryAction";
import { tabs } from "../../untils/variable-define";
import { TopicPrimaryStyle, TopicSecondaryStyle } from "./styles";
import { dateFormate } from "../../untils/untils";

import FavoriteIcon from "@material-ui/icons/Favorite";
import IconButton from "@material-ui/core/IconButton";
const Primary = ({ classes, topic }) => {
  const classnames = cx({
    [classes.tab]: true,
    [classes.top]: topic.top,
  });
  return (
    <div className={classes.root}>
      <span className={classnames}>{topic.top ? "置顶" : tabs[topic.tab]}</span>
      <span className={classes.title}>{topic.title}</span>
    </div>
  );
};

const StyledPrimary = withStyles(TopicPrimaryStyle)(Primary);

const Secondary = ({ classes, topic }) => {
  return (
    <span className={classes.root}>
      <span className={classes.userName}>{topic.author.loginname}</span>
      <span className={classes.accentColor}>{topic.reply_count}</span>
      <span>/</span>
      <span className={classes.count}>{topic.visit_count}</span>
      <span>
        创建时间：
        {dateFormate(topic.create_at)}
      </span>
    </span>
  );
};
const StyledSecondary = withStyles(TopicSecondaryStyle)(Secondary);
const TopicListItem = ({ onClick, topic, topicStore, appState, tab }) => {
  const [collected, setCollected] = useState("primary");
  useEffect(() => {
    appState.user.collections.list.forEach(collect => {
      if (collect.id === topic.id) {
        setCollected("secondary");
      }
    });
  }, [appState.user.collections.list]);
  return (
    <ListItem button onClick={onClick}>
      <ListItemAvatar>
        <Avatar src={topic.author.avatar_url} />
      </ListItemAvatar>
      <ListItemText primary={<StyledPrimary topic={topic} />} secondary={<StyledSecondary topic={topic} />} />
      <ListItemSecondaryAction
        onClick={
          collected
            ? () => {
                topicStore.unfavarite(topic.id, appState.user.token).then(res => {
                  if (res.success) {
                    alert("取消关注成功");
                    setCollected("primary");
                    // topicStore.fetchTopics(tab);
                  }
                });
              }
            : () => {
                topicStore
                  .favarite(topic.id, appState.user.token)
                  .then(res => {
                    if (res.success) {
                      alert("关注成功");
                      setCollected("secondary");
                      // topicStore.fetchTopics(tab);
                    }
                  })
                  .catch(err => {
                    alert("关注失败稍后重试");
                  });
              }
        }>
        <IconButton edge="end" aria-label="delete">
          <FavoriteIcon color={collected} />
        </IconButton>
      </ListItemSecondaryAction>
    </ListItem>
  );
};

Primary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

Secondary.propTypes = {
  topic: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

TopicListItem.propTypes = {
  topic: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
};

export default TopicListItem;
