import axios from 'axios';
import { Toast } from 'antd-mobile';
import proxy from '../configs/host';

import { TOKEN_NAME } from '../configs';

const env = import.meta.env.MODE || 'development';
const API_HOST = proxy[env].API;

const SUCCESS_CODE = 0;
const TIMEOUT = 120000;

export const instance = axios.create({
  baseURL: API_HOST,
  timeout: TIMEOUT,
  // withCredentials: true,
});

// 添加请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 尝试从localStorage获取token
    const token = localStorage.getItem(TOKEN_NAME);
    if (token) {
      // 如果token存在，添加到请求头中
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    console.log('error:');
    return Promise.reject(error);
  },
);

instance.interceptors.response.use(
  // eslint-disable-next-line consistent-return
  (response) => response,
  (error) => {
    const { response } = error;
    if (response.status === 401) {
      if (!String(window.location).includes('/login')) {
        Toast.show({
          icon: 'fail',
          content: '登录超时，请重新登陆',
        });
        window.location.replace('/login');
      }
    } else if (response.status === 403) {
      Toast.show({
        icon: 'fail',
        content: '没有执行该操作的权限',
      });
    } else if (response.status === 400) {
      let errorMsg = '查询出错';
      if (response.data && typeof response.data === 'object') {
        errorMsg = `${Object.values(response.data)}`;
        if (typeof Object.values(response.data)[0] === 'object') {
          errorMsg = JSON.stringify(Object.values(response.data));
        }
      } else if (response.data) {
        errorMsg = JSON.stringify(response.data);
      }
      Toast.show({
        icon: 'fail',
        content: `${errorMsg}`,
      });
    } else {
      if (response.config.url.includes('recruit/ext/detail_from_mobile')) {
        return Promise.reject(error);
      }
      let errorMsg = '查询出错';
      if (typeof response.data === 'object') {
        errorMsg = `${Object.values(response.data)}`;
      } else if (response.data) {
        errorMsg = JSON.stringify(response.data);
      }
      Toast.show({
        icon: 'fail',
        content: `${errorMsg}`,
      });
    }
    return Promise.reject(error);
  },
);

export default instance;
