/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/require-default-props */
import React from 'react'
import PropTypes from 'prop-types'
import { withStyles } from '@material-ui/core/styles'

const styles = {
  root: {
    margin: 24,
    marginTop: 70
  }
}
const Container = ({ classes, children }) => (
  <div className={classes.root}>{children}</div>
)

Container.propTypes = {
  classes: PropTypes.object.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.element),
    PropTypes.element
  ])
}

export default withStyles(styles)(Container)
