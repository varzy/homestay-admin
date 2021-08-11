import axios from 'axios';

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    return Promise.reject(err);
  }
);

export default instance;
