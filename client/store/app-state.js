import { observable, computed, action, toJS } from "mobx";

import { get, post } from "../untils/http";
import { setLocalStorage, getLocalStorage } from "../untils/untils";
export default class AppState {
  @observable user = Object.assign(
    {
      isLogin: false,
      token: "",
      info: {},
      userInfo: {},
      messagesAcount: 0,
      detail: {
        recentTopics: [],
        recentReplies: [],
        syncing: false,
      },
      collections: {
        syncing: false,
        list: [],
      },
      messages: {
        syncing: false,
        list: {},
      },
    },
    getLocalStorage("user"),
  );

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

  @action getMessages(mdrender = true) {
    this.user.messages.syncing = true;
    console.log(this.user.token);
    return new Promise((resolve, reject) => {
      get(`/messages`, {
        accesstoken: this.user.token,
        mdrender,
      })
        .then(resp => {
          if (resp.success) {
            this.user.messages.list = resp.data;
            resolve(resp.data);
          }
          this.user.messages.syncing = false;
        })
        .catch(err => {
          this.user.messages.syncing = true;
          reject(err);
        });
    });
  }
  @action getMessagesAcount() {
    return new Promise((resolve, reject) => {
      get(`/message/count`, {
        accesstoken: this.user.token,
      })
        .then(res => {
          this.messagesAcount = res.data;
          if (res.success) {
            resolve(res.data);
          }
        })
        .catch(err => {
          reject(err);
        });
    });
  }

  @action messageMarkAll() {
    return new Promise((resolve, reject) => {
      post(
        " /message/mark_all",
        {},
        {
          accesstoken: this.user.token,
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
  @action messageMarkOne(id) {
    return new Promise((resolve, reject) => {
      post(
        `/message/mark_all/${id}`,
        {},
        {
          accesstoken: this.user.token,
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

  @action getUserInfo(username = "") {
    return new Promise((resolve, reject) => {
      get(`/user/${username}`, {})
        .then(res => {
          this.userinfo = res.data;
          if (res.success) {
            resolve(res.data);
          }
        })
        .catch(err => {
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
