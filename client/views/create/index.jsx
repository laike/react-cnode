/* eslint-disable no-unused-vars */
import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import { withStyles } from "@material-ui/core/styles";

import {
  Paper,
  Fab,
  Radio,
  FormControl,
  FormControlLabel,
  RadioGroup,
  Divider,
  InputLabel,
  Input,
} from "@material-ui/core";
import {
  Add as AddIcon,
  RadioButtonUnchecked as RadioButtonUncheckedIcon,
  RadioButtonChecked as RadioButtonCheckedIcon,
} from "@material-ui/icons";

import { green } from "@material-ui/core/colors";

import { Helmet } from "react-helmet";

import SimpleMDE from "react-simplemde-editor";
import AppState from "../../store/app-state";
import { ContentStyle } from "./styles";
import Container from "../layout/container";

import { tabs } from "../../untils/variable-define";

@inject(stores => {
  return {
    appState: stores.appState,
    topicStore: stores.topicStore,
  };
})
@observer
class TopicList extends React.Component {
  constructor() {
    super();
    this.state = {
      mdeValue: "",
      tab: "all",
      title: "",
    };
    this.handleChange = this.handleChange.bind(this);
    this.selectChange = this.selectChange.bind(this);
  }

  componentDidMount() {
    // dosomething here
  }

  handleChange(value) {
    this.setState({
      mdeValue: value,
    });
  }

  selectChange(event) {
    this.setState({
      tab: event.target.value,
    });
  }

  render() {
    const { topicStore, classes, appState } = this.props;
    let { user } = appState;
    const { mdeValue, tab, title } = this.state;
    return (
      <Container>
        <Helmet>
          <title>创建话题 </title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Paper>
          <FormControl fullWidth className={classes.fmcontainer}>
            <InputLabel htmlFor="standard-title">请输入标题</InputLabel>
            <Input
              id="standard-title"
              value={title}
              onChange={val =>
                this.setState({
                  title: val,
                })
              }
            />
          </FormControl>

          <Divider />
          {user.isLogin ? (
            <div className={classes.mde}>
              <SimpleMDE
                onChange={this.handleChange}
                id="simplereactmde"
                value={mdeValue}
                options={{
                  autosave: {
                    enabled: true,
                    uniqueId: "id",
                    delay: 1000,
                  },
                }}
              />
              <Fab color="secondary" aria-label="add" className={classes.iconHover}>
                <AddIcon />
              </Fab>
              <div className={classes.radios}>
                <FormControl component="fieldset">
                  <RadioGroup aria-label="position" name="position" value={tab} onChange={this.selectChange} row>
                    {Object.keys(tabs).map(tb => (
                      <FormControlLabel
                        key={tb}
                        value={tb}
                        control={<Radio color="primary" />}
                        label={tabs[tb]}
                        labelPlacement="end"
                      />
                    ))}
                  </RadioGroup>
                </FormControl>
              </div>
            </div>
          ) : null}
        </Paper>
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  topicStore: PropTypes.instanceOf(AppState),
  appState: PropTypes.object.isRequired,
};

TopicList.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(ContentStyle)(TopicList);
