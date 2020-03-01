import { observable, computed, action, toJS } from "mobx";

import { get, post } from "../untils/http";
import { setLocalStorage, getLocalStorage } from "../untils/untils";
export default class AppState {
  @observable user = getLocalStorage("user")
    ? getLocalStorage("user")
    : {
        isLogin: false,
        token: "",
        info: {},
        detail: {
          recentTopics: [],
          recentReplies: [],
          syncing: false,
        },
        collections: {
          syncing: false,
          list: [],
        },
      };

  @action setUser(user) {
    this.user = user;
  }

  @action login(accessToken) {
    return new Promise((resolve, reject) => {
      post(
        "/user/login",
        {},
        {
          accesstoken: accessToken,
        },
      )
        .then(resp => {
          if (resp.success) {
            this.user.info = resp.data;
            this.user.isLogin = true;
            this.user.token = accessToken;
            // set localstorage data
            setLocalStorage("user", this.user);
            resolve(resp);
          }
        })
        .catch(err => {
          console.log("/user/login err");
          reject(err);
        });
    });
  }

  @action getUserDetail(loginname) {
    this.user.detail.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/user/${loginname}`, {})
        .then(resp => {
          if (resp.success) {
            this.user.detail.recentReplies = resp.data.recent_replies;
            this.user.detail.recentTopics = resp.data.recent_topics;
            resolve();
          } else {
            reject();
          }
          this.user.detail.syncing = false;
        })
        .catch(err => {
          this.user.detail.syncing = true;
          reject(err);
        });
    });
  }
  @computed get Collections() {
    return this.user.collections.reduce((result, collect) => {
      result[collect.id] = collect;
      return result;
    }, {});
  }
  @action getUserCollections(loginname) {
    this.user.collections.syncing = true;
    return new Promise((resolve, reject) => {
      get(`/topic_collect/${loginname}`, {})
        .then(resp => {
          if (resp.success) {
            this.user.collections.list = resp.data;
            resolve(resp.data);
          } else {
            reject();
          }
          this.user.collections.syncing = false;
        })
        .catch(err => {
          this.user.collections.syncing = true;
          reject(err);
        });
    });
  }

  toJson() {
    return {
      user: toJS(this.user),
    };
  }
}
