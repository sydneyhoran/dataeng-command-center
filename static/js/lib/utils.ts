import axios from 'axios';

const API_PREFIX = '/api/v1/';

axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};

export const generateID = ():string => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(
  /[xy]/g,
  (c) => {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : ((r & 0x3) | 0x8);
    return v.toString(16);
  },
);

// ***** API *****

export const getRequest = (route: string, cb: Function, err_cb: Function = () => {}): void => {
  console.log("in utils.ts getRequest");
  axios
    .get(API_PREFIX + route)
    .then(res => cb(res.data.response))
    .catch((err) => {
      console.log(err);
      err_cb(err);
    });
};

export const postRequest = (route: string, payload: {}, cb: Function, err_cb: Function = () => {}): void => {
  console.log("in utils.ts postRequest");
  console.log("route is " + route);
  console.log("payload is " + payload);
  axios
    .post(API_PREFIX + route, payload, { 'headers': {'Content-Type': 'application/json' }})
    .then((res) => {
        cb(res.data.response);
    })
    .catch((err) => {
      console.log(err);
      err_cb(err);
    });
};

export const deleteRequest = (route: string, cb: Function, err_cb: Function = () => {}): void => {
  axios
    .delete(API_PREFIX + route)
    .then(res => cb(res.data.response))
    .catch((err) => {
      console.log(err);
      err_cb(err);
    });
};
