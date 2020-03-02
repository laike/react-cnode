import React from "react";

import { observer, inject } from "mobx-react";

import PropTypes from "prop-types";

import { withRouter } from "react-router";

import CircularProgress from "@material-ui/core/CircularProgress";
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import List from "@material-ui/core/List";

import { Helmet } from "react-helmet";

import Container from "../layout/container";

import TopicListItem from "./list-item";

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
    this.changeTab = this.changeTab.bind(this);
    this.listItemClick = this.listItemClick.bind(this);
  }

  componentDidMount() {
    // dosomething here
    const { topicStore, appState } = this.props;
    const tab = this.getTab();
    topicStore.fetchTopics(tab);
    //预渲染collection list
    appState.getUserCollections(appState.user.info.loginname).then(res => {});
  }

  componentDidUpdate(prevProps, prevState, snapshot) {
    const { location, topicStore } = this.props;
    if (prevProps.location.pathname !== location.pathname) {
      topicStore.fetchTopics(this.getTab(this.getTab()));
    }
  }

  getTab(search) {
    const { match } = this.props;
    const { tab } = match.params;
    return tab || "all";
  }

  changeTab(e, value) {
    // route object
    const { history } = this.props;
    history.push({
      pathname: `/list/${value}`,
    });
  }

  listItemClick(topic) {
    const { history } = this.props;
    history.push(`/detail/${topic.id}`);
  }

  bootstrap() {
    return new Promise(resolve => {
      setTimeout(() => {
        resolve(1);
      }, 2000);
    });
  }

  render() {
    const { topicStore } = this.props;
    const topicList = topicStore.topics;
    let tab = this.getTab();
    return (
      <Container>
        <Helmet>
          <title>CnodeJs 首页 </title>
          <meta name="description" content="this is description" />
        </Helmet>
        <Tabs value={tab} onChange={this.changeTab}>
          {Object.keys(tabs).map(tb => (
            <Tab value={tb} label={tabs[tb]} key={tb} />
          ))}
        </Tabs>
        <List>
          {topicList.map(topic => (
            <TopicListItem
              key={topic.id}
              topic={topic}
              onClick={() => this.listItemClick(topic)}
              {...this.props}
              tab={tab}
            />
          ))}
        </List>
        {topicStore.syncing ? (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              padding: 50,
              alignItems: "center",
            }}>
            <CircularProgress color="primary" size={50} />
          </div>
        ) : null}
      </Container>
    );
  }
}

TopicList.wrappedComponent.propTypes = {
  // topicStore: PropTypes.instanceOf(AppState)
  topicStore: PropTypes.object.isRequired,
};

TopicList.propTypes = {
  location: PropTypes.object.isRequired,
  history: PropTypes.object.isRequired,
  match: PropTypes.object.isRequired,
};
TopicList.loadData = (store, query) => {
  let { tab } = query;
  tab = tab ? tab : "all";
  return store.topicStore.fetchTopics(tab);
};
export default withRouter(TopicList);
