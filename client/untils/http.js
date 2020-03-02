import axios from "axios";
import qs from "query-string";
const baseUrl = process.env.API_BASE || "";
const HttpManager = axios.create({
  baseURL: "https://cnodejs.org/api/v1",
  headers: {
    "Content-Type": "application/x-www-form-urlencoded",
  },
});

function parseUrl(url, params) {
  const str = Object.keys(params).reduce((result, key) => {
    // eslint-disable-next-line no-param-reassign
    result += `${key}=${params[key]}&`;
    return result;
  }, "");
  return `${baseUrl}/api${url}?${str.substr(0, str.length - 1)}`;
}

export const get = (url, params) => {
  return new Promise((resolve, reject) => {
    //   HttpManager.get(url, {
    //     params,
    //   })
    //     .then(resp => {
    //       const { data } = resp;
    //       if (data && data.success === true) {
    //         resolve(data);
    //       } else {
    //         reject(data);
    //       }
    //     })
    //     .catch(reject);
    // });

    axios
      .get(parseUrl(url, params))
      .then(resp => {
        const { data } = resp;
        if (data && data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(reject);
  });
};

export const post = (url, params, data1) => {
  return new Promise((resolve, reject) => {
    // HttpManager.post(url, { params }, qs.stringify(Object.assign({}, data1)))
    //   .then(resp => {
    //     const { data } = resp;
    //     if (data && data.success === true) {
    //       resolve(data);
    //     } else {
    //       reject(data);
    //     }
    //   })
    //   .catch(reject);

    axios
      .post(parseUrl(url, params), data1)
      .then(resp => {
        const { data } = resp;
        if (data && data.success === true) {
          resolve(data);
        } else {
          reject(data);
        }
      })
      .catch(reject);
  });
};
