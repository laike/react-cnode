import { isObject } from "util";
import parseUrl from "url-parse";
import moment from "moment";
import momentLocale from "moment/locale/zh-cn";
moment.updateLocale("zh-cn", momentLocale);

/**
 *
 * @param {*} item
 * @param {*} value
 */
export function setLocalStorage(item, value) {
  if (isObject(value)) {
    // if is object use stringify parse object
    return localStorage.setItem(item, JSON.stringify(value));
  }
  return localStorage.setItem(item, value);
}
/**
 *
 * @param {*} item
 */
export function getLocalStorage(item) {
  // console.log(localStorage)
  // if is stringify parse is object return object
  try {
    if (isObject(JSON.parse(localStorage.getItem(item)))) {
      return JSON.parse(localStorage.getItem(item));
    }
    return localStorage.getItem(item);
  } catch (error) {
    return {};
  }
}

export const dateFormate = date => {
  return moment(date).format("MMMM Do YYYY, h:mm:ss a");
};
