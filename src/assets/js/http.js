import axios from 'axios'
import qs from 'querystring'
import api from './api.js'
import {plusKey} from "./locationStorage";

// axios.defaults.headers.common['Authorization'] = 'AUTH_TOKEN';
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';

// 添加请求拦截器
axios.interceptors.request.use(function (config) {
  // 在发送请求之前做些什么
  return config;
}, function (error) {
  // 对请求错误做些什么
  return Promise.reject(error);
});

// 添加响应拦截器
axios.interceptors.response.use(function (response) {
  // 对响应数据做点什么
  return response;
}, function (error) {
  // 对响应错误做点什么
  return Promise.reject(error);
});


const httpServer = (opts) => {
  mui.plusReady(() => {
    console.log('去请求');
    if (plus.storage.getItem(plusKey.token) === null && plus.storage.getItem(plusKey.temporaryToken) === null) {
      console.log('获取临时Token');
      axios.get(api.system_token).then((res) => {
        let data = res.data;
        if (data.code === '00000') {
          plus.storage.setItem(plusKey.temporaryToken, data.data);
        } else {
          mui.toast('服务器异常');
          return;
        }
      }).catch(() => {
        mui.toast('请求失败？？？');
      })
    }

    opts['method'] = opts.method || 'get';
    let Public = { //公共参数

    };
    let httpDefaultOpts = { //http默认配置
      method: opts.method,
      url: opts.url,
      timeout: 10000,
      params: Object.assign(Public, opts.data),
      data: qs.stringify(Object.assign(Public, opts.data)) || opts.data,
      headers: opts.method === 'get' ? {
        'X-Requested-With': 'XMLHttpRequest',
        "Accept": "application/json",
        "Content-Type": "application/json; charset=UTF-8",
        "token": plus.storage.getItem(plusKey.token) || plus.storage.getItem(plusKey.temporaryToken),
        // "token": 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4Y2RkMmJjMWRkNzU2MGJlMWY1MjBhYzBkNzk3ZTljZiIsImlhdCI6MTUzMDE3OTY0OSwic3ViIjoiMjAxODA2MjgxNTE3Mjk1NTY1OCIsImlzcyI6ImtiYXBwYmFja2dyb3VkYXBpIiwiaXNHdWVzdCI6ZmFsc2V9.LyqcU1bnqm49lRJitsgTxJ8JP4XpsfIXtBc0IYhsB_E',
      } : {
        'X-Requested-With': 'XMLHttpRequest',
        'Content-Type': opts['headers'] ? opts['headers']['contentType'] : 'application/x-www-form-urlencoded; charset=UTF-8',
        "token": plus.storage.getItem(plusKey.token) || plus.storage.getItem(plusKey.temporaryToken),
        // "token": 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4Y2RkMmJjMWRkNzU2MGJlMWY1MjBhYzBkNzk3ZTljZiIsImlhdCI6MTUzMDE3OTY0OSwic3ViIjoiMjAxODA2MjgxNTE3Mjk1NTY1OCIsImlzcyI6ImtiYXBwYmFja2dyb3VkYXBpIiwiaXNHdWVzdCI6ZmFsc2V9.LyqcU1bnqm49lRJitsgTxJ8JP4XpsfIXtBc0IYhsB_E',
      }
    };
    console.log(httpDefaultOpts.data);
    if (opts.method === 'get' || opts.method === 'delete') {
      delete httpDefaultOpts.data
    } else {
      delete httpDefaultOpts.params
    }

    if (opts.method === 'delete') {
      httpDefaultOpts.params = opts.data;
    }

    axios(httpDefaultOpts).then((res) => {
        let data = res.data;
        console.log('请求返回');
        console.log(data.code);
        console.log(data.msg);
        if (data.code === '00000') {
          opts.success(data.data);
        } else if (data.code === '40001') {
          console.log('权限失效');
          plus.storage.removeItem(plusKey.temporaryToken);
          httpServer(opts);
        } else {
          opts.error(data);
        }
      }
    ).catch((response) => {
        if (response) {

        } else {
          mui.toast('请求异常');
        }
      }
    )
  });
};
export default httpServer
