import React from "react";
import PropTypes from "prop-types";
import { Grid, ButtonBase, Paper, Typography } from "@material-ui/core";
import dateFormat from "dateformat";
import { makeStyles, createStyles, Theme } from "@material-ui/core/styles";
import md from "marked";

function getMarkdownText(mark) {
  let rawMarkup = md(mark);
  return { __html: rawMarkup };
}
const useStyles = makeStyles(theme =>
  createStyles({
    root: {
      flexGrow: 1,
    },
    paper: {
      padding: theme.spacing(2),
      margin: "10px auto",
    },
    image: {
      width: 60,
      height: 60,
    },
    img: {
      margin: "auto",
      display: "block",
      maxWidth: "100%",
      maxHeight: "100%",
      borderRadius: "50%",
    },
  }),
);

export default function Reply({ reply }) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
      <Paper className={classes.paper}>
        <Grid container spacing={2}>
          <Grid item>
            <ButtonBase className={classes.image}>
              <img className={classes.img} alt="complex" src={reply.author.avatar_url} />
            </ButtonBase>
          </Grid>
          <Grid item xs={12} sm container>
            <Grid item xs container direction="column" spacing={2}>
              <Grid item xs>
                <Typography gutterBottom variant="subtitle1">
                  {dateFormat(reply.create_at, "dddd, mmmm dS, yyyy, h:MM:ss TT")}
                </Typography>
                <Typography variant="body2" gutterBottom>
                  <p dangerouslySetInnerHTML={getMarkdownText(reply.content)} />
                </Typography>
              </Grid>
              <Grid item>
                {/* <Typography variant="body2" style={{ cursor: 'pointer' }}>
                  Remove
                </Typography> */}
              </Grid>
            </Grid>
            {/* <Grid item>
              <Typography variant="subtitle1">$19.00</Typography>
            </Grid> */}
          </Grid>
        </Grid>
      </Paper>
    </div>
  );
}

Reply.propTypes = {
  reply: PropTypes.object.isRequired,
};
