import axios from 'axios'
import qs from 'querystring'
import api from './api.js'
import {plusKey} from "./locationStorage";
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
    console.log('我是token'+plus.storage.getItem(plusKey.token));
    console.log('我是临时token'+plus.storage.getItem(plusKey.temporaryToken));
    opts['method'] = opts.method || 'get';
    opts['dataType'] = opts.dataType || false;
    let publicHeaders = {
      "token": plus.storage.getItem(plusKey.token) || plus.storage.getItem(plusKey.temporaryToken),
      // "token": 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4Y2RkMmJjMWRkNzU2MGJlMWY1MjBhYzBkNzk3ZTljZiIsImlhdCI6MTUzMDE3OTY0OSwic3ViIjoiMjAxODA2MjgxNTE3Mjk1NTY1OCIsImlzcyI6ImtiYXBwYmFja2dyb3VkYXBpIiwiaXNHdWVzdCI6ZmFsc2V9.LyqcU1bnqm49lRJitsgTxJ8JP4XpsfIXtBc0IYhsB_E',
    };
    let httpDefaultOpts = { //http默认配置
      method: opts.method,
      url: opts.url,
      timeout: 10000,
      params: opts.data,
      data: opts.dataType ? opts.data : qs.stringify(opts.data),
      headers: Object.assign(publicHeaders, opts.headers),
    };
    console.log(httpDefaultOpts.data);
    if (opts.method === 'post') {
      delete httpDefaultOpts.params
    } else {
      delete httpDefaultOpts.data
    }

    axios(httpDefaultOpts).then((res) => {
        let data = res.data;
        console.log('请求返回');
        console.log(data.code);
        console.log(data.msg);
        console.log(JSON.stringify(data.data));
        if (data.code === '00000') {
          opts.success(data.data);
        } else if (data.code === '404') {
          opts.noFind(data.data);
        } else if (data.code === '40001') {
          mui.toast('游客权限失效');
          plus.storage.removeItem(plusKey.temporaryToken);
          httpServer(opts);
        } else {
          mui.toast(data.msg);
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
