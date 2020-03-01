import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import dateFormat from "dateformat";

import MarkdowIt from "markdown-it";

import hljs from "highlight.js";

import "../../css/github.css";

import {
  Card,
  CardHeader,
  CardActions,
  CardActionArea,
  CardContent,
  CardMedia,
  CircularProgress,
  Avatar,
  IconButton,
  Paper,
  Fab,
} from "@material-ui/core";

import { MoreVertIcon, Add as AddIcon } from "@material-ui/icons";

import queryString from "query-string";

import { Helmet } from "react-helmet";

import { withStyles } from "@material-ui/core/styles";
import SimpleMDE from "react-simplemde-editor";
import AppState from "../../store/app-state";

import Container from "../layout/container-detail";

import Reply from "./reply_simple";

import { tabs } from "../../untils/variable-define";
import { ContentStyle } from "./styles";

const md = MarkdowIt({
  html: true,
  linkify: true,
  typographer: true,
  breaks: true,
  highlight(str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre class="hljs"><code>${hljs.highlight(lang, str, true).value}</code></pre>`;
      } catch (__) {
        console.log(__);
      }
    }
    return `<pre class="hljs"><code>${md.utils.escapeHtml(str)}</code></pre>`;
  },
});

@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  };
})
@observer
class TopicDetail extends React.Component {
  constructor() {
    super();
    this.state = {
      mdeValue: "",
    };

    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    let { topicStore } = this.props;
    let id = this.getDetailId();
    topicStore.getTopicDetail(id);
  }

  getDetailId() {
    let { match } = this.props;
    return match.params.id || "";
  }

  getMarkdownText(mark) {
    let rawMarkup = md.render(mark);
    return { __html: rawMarkup };
  }

  handleChange(value) {
    this.setState({
      mdeValue: value,
    });
  }

  render() {
    let { topicStore, classes, appState } = this.props;
    let id = this.getDetailId();
    let { user } = appState;
    let { mdeValue } = this.state;
    let topic = topicStore.detailMap[id];
    let config = {
      text: "回到顶部",
      topDistance: 10,
      timing: "easeIn",
      background: "blue",
    };
    if (!topic) {
      return (
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}>
          <CircularProgress color="primary" size={50} />
        </div>
      );
    }
    return (
      <Container>
        <Helmet>
          <title>this is topic detail page </title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Card
          style={{
            marginBottom: 10,
          }}>
          <div>
            <CardHeader
              avatar={<Avatar aria-label="recipe" src={topic.author.avatar_url} />}
              title={topic.title}
              subheader={dateFormat(topic.create_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
            />
            <CardContent className={classes.content}>
              <div dangerouslySetInnerHTML={this.getMarkdownText(topic.content)} />
            </CardContent>
          </div>
        </Card>
        <Paper>
          {user.isLogin ? (
            <div className={classes.mde}>
              <SimpleMDE
                onChange={this.handleChange}
                id="simplereactmde"
                value={mdeValue}
                options={{
                  autosave: {
                    enabled: true,
                    uniqueId: id,
                    delay: 1000,
                  },
                }}
              />
              <Fab color="secondary" aria-label="add" className={classes.iconHover}>
                <AddIcon />
              </Fab>
            </div>
          ) : null}
        </Paper>
        <Paper>{topicStore.syncing ? null : topic.replies.map(reply => <Reply reply={reply} key={reply.id} />)}</Paper>
        {topicStore.syncing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}>
            <CircularProgress color="primary" size={50} />
          </div>
        ) : null}
      </Container>
    );
  }
}

TopicDetail.wrappedComponent.propTypes = {
  topicStore: PropTypes.any,
  appState: PropTypes.object.isRequired,
};

TopicDetail.propTypes = {
  match: PropTypes.object.isRequired,
  classes: PropTypes.object.isRequired,
};
TopicDetail.loadData = (store, query) => {
  const { id } = query;
  return store.topicStore.getTopicDetail(id || "");
};
export default withStyles(ContentStyle)(TopicDetail);
