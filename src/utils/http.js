import axios from 'axios';
import { Message as ElMessage } from 'element-ui';

const instance = axios.create({
  baseURL: '/api',
  timeout: 20000,
});

instance.interceptors.response.use(
  (res) => res,
  (err) => {
    ElMessage.error('网络异常，请稍候重试');
    return Promise.reject(err);
  }
);

export default instance;
