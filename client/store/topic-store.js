import { observable, toJS, computed, action, extendObservable } from "mobx";

import { get, post } from "../untils/http";

import { topicSchema } from "../untils/variable-define";

function createTopic(topic) {
  return { ...topicSchema, ...topic };
}

class Topic {
  constructor(data) {
    extendObservable(this, data);
  }

  @observable syncing = false;
}

class TopicStore {
  @observable topics;

  @observable syncing;

  @observable details;

  @observable tab = "all";

  constructor({ syncing = true, topics = [], details = [] } = {}) {
    this.syncing = syncing;
    this.topics = topics.map(topic => new Topic(createTopic(topic)));
    this.details = details.map(detail => new Topic(createTopic(detail)));
  }

  addTopic(topic) {
    this.topics.push(new Topic(createTopic(topic)));
  }

  @computed get detailMap() {
    return this.details.reduce((result, detail) => {
      result[detail.id] = detail;
      return result;
    }, {});
  }

  @action fetchTopics(tab) {
    return new Promise((resolve, reject) => {
      // 这里需要判断是否需要获取新的数据
      if (this.tab === tab) {
        resolve();
      } else {
        this.tab = tab;
        this.topics = [];
        this.syncing = true;
      }
      get("/topics", { mdrender: false, tab })
        .then(resp => {
          if (resp.success) {
            this.topics = [];
            resp.data.forEach(topic => {
              this.addTopic(topic);
            });
            this.syncing = false;
            resolve();
          } else {
            reject();
            this.syncing = false;
          }
        })
        .catch(err => {
          reject(err);
          this.syncing = false;
        });
    });
  }

  @action getTopicDetail(id) {
    return new Promise((resolve, reject) => {
      if (this.detailMap[id]) {
        console.log("this data in detailMap");
        resolve(this.detailMap[id]);
      } else {
        this.syncing = true;
        console.log(`this.syncing is : `, this.syncing);
        get(`/topic/${id}`, {
          mdrender: false,
        })
          .then(resp => {
            if (resp.success) {
              this.details = []; // empty arrs
              let detail = new Topic(createTopic(resp.data));
              this.details.push(detail);
              this.syncing = false;
              resolve();
            } else {
              reject();
              this.syncing = false;
            }
          })
          .catch(err => {
            console.log(err);
            reject(err);
            this.syncing = false;
          });
      }
    });
  }
  /**
   * 收藏主题
   * @param {*} topicId
   * @param {*} token
   */
  @action favarite(topicId, token) {
    return new Promise((resolve, reject) => {
      post(
        "/topic_collect/collect",
        {},
        {
          accesstoken: token,
          topic_id: topicId,
        },
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }
  /**
   * 取消收藏主题
   * @param {*} topicId
   * @param {*} token
   */
  @action unfavarite(topicId, token) {
    return new Promise((resolve, reject) => {
      post(
        "/topic_collect/de_collect",
        {},
        {
          accesstoken: token,
          topic_id: topicId,
        },
      )
        .then(res => {
          resolve(res);
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  toJson() {
    return {
      topics: toJS(this.topics),
      syncing: this.syncing,
      details: toJS(this.details),
    };
  }
}

export default TopicStore;
