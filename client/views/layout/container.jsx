/* eslint-disable react/require-default-props */
/* eslint-disable react/forbid-prop-types */
import React from "react";
import PropTypes from "prop-types";
import { Paper } from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  root: {
    margin: 24,
    marginTop: 70,
  },
};
const Container = ({ classes, children, props }) => (
  <Paper elevation={4} className={classes.root}>
    {children}
  </Paper>
);

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.element), PropTypes.element]),
  props: PropTypes.any,
};

export default withStyles(styles)(Container);
