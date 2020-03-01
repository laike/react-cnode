import React from "react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import { BottomNavigation, BottomNavigationAction } from "@material-ui/core";

import {
  Restore as RestoreIcon,
  Favorite as FavoriteIcon,
  LocationOn as LocationOnIcon,
  Folder as FolderIcon,
} from "@material-ui/icons";

const styles = {
  bottom: {
    width: "100%",
    position: "fixed",
    bottom: 0,
    left: 0,
  },
  flex: {
    flex: 1,
  },
};

class BottomNavBar extends React.Component {
  constructor() {
    super();

    this.state = {
      value: "recents",
    };
    this.handleChange = this.handleChange.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  handleChange() {}

  render() {
    const { classes, history } = this.props;
    return (
      <BottomNavigation
        value={this.state.value}
        onChange={(event, newValue) => {
          this.setState({
            value: newValue,
          });
        }}
        className={classes.bottom}>
        <BottomNavigationAction
          label="Recents"
          value="recents"
          icon={<RestoreIcon />}
          onClick={() => {
            history.push("/");
          }}
        />
        <BottomNavigationAction
          label="Favorites"
          value="favorites"
          icon={<FavoriteIcon />}
          onClick={() => {
            history.push("/user/info");
          }}
        />
        <BottomNavigationAction label="Nearby" value="nearby" icon={<LocationOnIcon />} />
      </BottomNavigation>
    );
  }
}
BottomNavBar.propTypes = {
  // eslint-disable-next-line react/forbid-prop-types
  classes: PropTypes.object.isRequired,
};
export default withStyles(styles)(BottomNavBar);
