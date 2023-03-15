import axios from 'axios';

const API_PREFIX = '/api/v1/';

axios.defaults.baseURL = window.location.origin;
axios.defaults.headers.common = {
  'X-Requested-With': 'XMLHttpRequest',
};

// ***** API *****

export const getRequest = (route: string, cb: Function, err_cb: Function = () => {}): void => {
  console.log("in utils.ts getRequest")
  axios
    .get(API_PREFIX + route)
    .then(res => cb(res.data.response))
    .catch((err) => {
      console.log(err);
      err_cb(err);
    });
};

//             <Route
//                 exact
//                 path="/"
//                 render={props => <DeltastreamerRoster {...props} {...app_defaults} />}
//             />