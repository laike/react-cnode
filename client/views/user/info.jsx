import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import {
  Avatar,
  Typography,
  TextField,
  Button,
  Grid,
  Paper,
  Snackbar,
  IconButton,
  SnackbarContent,
  Chip,
  ListItem,
  List,
  ListItemText,
} from "@material-ui/core";
import { amber, green } from "@material-ui/core/colors";
import { VerifiedUser as UserIcon, CheckCircle, Warning, Error, Info, Close, ArrowUpward } from "@material-ui/icons";

import { withStyles } from "@material-ui/core/styles";

import { Helmet } from "react-helmet";

import AppState from "../../store/app-state";

import Container from "../layout/container";

import { infoStyels } from "./styles/info";

const TopicItem = ({ topic }) => {
  return (
    <ListItem>
      <Avatar src={topic.author.avatar_url} />
      <ListItemText primary={topic.title} secondar={`最新回复：${topic.last_reply_at}`} />
    </ListItem>
  );
};

TopicItem.propTypes = {
  topic: PropTypes.object.isRequired,
};
@inject(stores => {
  return {
    appState: stores.appState,
    user: stores.appState.user,
  };
})
@observer
class UserInfo extends React.Component {
  componentDidMount() {
    // dosomething here
    const { history, appState } = this.props;
    appState.getUserDetail(appState.user.info.loginname);
    appState.getUserCollections(appState.user.info.loginname);
  }
  render() {
    let { classes, appState } = this.props;
    let { user } = appState;
    let topics = user.detail.recentTopics;
    let replies = user.detail.recentReplies;
    let collections = user.collections.list;
    return (
      <Container>
        <Paper className={classes.root}>
          <Helmet>
            <title>用户中心</title>
            <meta name="description" content="用户中心" />
          </Helmet>
          <div className={classes.bg}>
            <Avatar src={user.info.avatar_url} />
            <Typography component={"span"}>{user.info.loginname}</Typography>
          </div>
          <div className={classes.infoBox}>
            <Grid container spacing={3}>
              <Grid item xs>
                <Paper className={classes.paper}>
                  <Chip avatar={<Avatar>M</Avatar>} label="最近发布的话题" />
                  <List>
                    {topics.length > 0 ? (
                      topics.map(topic => <TopicItem topic={topic} key={topic.id} />)
                    ) : (
                      <Typography>最近没有发布的新话题</Typography>
                    )}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>
                  <Chip avatar={<Avatar>M</Avatar>} label="新回复" />
                  <List>
                    {replies.length > 0 ? (
                      replies.map(topic => <TopicItem topic={topic} key={topic.id} />)
                    ) : (
                      <Typography>最近没有回复</Typography>
                    )}
                  </List>
                </Paper>
              </Grid>
              <Grid item xs>
                <Paper className={classes.paper}>
                  <Chip avatar={<Avatar>M</Avatar>} label="收藏的话题" />
                  <List>
                    {collections.length > 0 ? (
                      collections.map(topic => <TopicItem topic={topic} key={topic.id} />)
                    ) : (
                      <Typography>最近没有搜藏的话题</Typography>
                    )}
                  </List>
                </Paper>
              </Grid>
            </Grid>
          </div>
        </Paper>
      </Container>
    );
  }
}

UserInfo.wrappedComponent.propTypes = {
  appState: PropTypes.instanceOf(AppState),
  user: PropTypes.object.isRequired,
};

UserInfo.propTypes = {
  history: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};

export default withStyles(infoStyels)(UserInfo);
