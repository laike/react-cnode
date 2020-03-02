import React from "react";
import PropTypes from "prop-types";
import { Avatar } from "@material-ui/core";
import dateFormat from "dateformat";
import { withStyles } from "@material-ui/core/styles";
import md from "marked";
import { ReplyStyle } from "./styles";

function getMarkdownText(mark) {
  let rawMarkup = md(mark);
  return { __html: rawMarkup };
}

const Reply = ({ classes, reply }) => (
  <div className={classes.root}>
    <div className={classes.avatar}>
      <Avatar src={reply.author.avatar_url} />
    </div>
    <div className={classes.info}>
      <h2 className={classes.title}>{dateFormat(reply.create_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}</h2>
      <p className={classes.content} dangerouslySetInnerHTML={getMarkdownText(reply.content)} />
    </div>
  </div>
);

Reply.propTypes = {
  classes: PropTypes.object.isRequired,
  reply: PropTypes.object.isRequired,
};

export default withStyles(ReplyStyle)(Reply);
