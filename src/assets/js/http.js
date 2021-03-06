import axios from 'axios'
import qs from 'querystring'
import api from './api.js'
import {plusKey} from "./locationStorage";
import myMethods from './methods'
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
    if (plus.networkinfo.getCurrentType() === 1) {
      console.log('当前网络状态不可用~');
      if (opts.connectionNone === undefined) {
        return
      }
      opts.connectionNone();
      return;
    }
    if (plus.storage.getItem(plusKey.token) === null && plus.storage.getItem(plusKey.temporaryToken) === null) {
      axios.get(api.system_token).then((res) => {
        let data = res.data;
        if (data.code === '00000') {
          plus.storage.setItem(plusKey.temporaryToken, data.data);
          httpServer(opts);
        } else {
          mui.toast('服务器异常');
        }
      }).catch(() => {
        console.log('请求失败');
      })
    } else {
      opts['method'] = opts.method || 'get';
      opts['dataType'] = opts.dataType || false;
      let publicHeaders = {
        "token": plus.storage.getItem(plusKey.token) || plus.storage.getItem(plusKey.temporaryToken),
        // "token": 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4Y2RkMmJjMWRkNzU2MGJlMWY1MjBhYzBkNzk3ZTljZiIsImlhdCI6MTUzMTM4MTYwMywic3ViIjoiMjAxODA3MTIxMTU4NTM1NTY1OCIsImlzcyI6ImtiYXBwYmFja2dyb3VkYXBpIiwiaXNHdWVzdCI6ZmFsc2V9.-a_uXcg2VJ2vz9hji2JPtWxkZ18sVza-NfAb80V9vYw',
      };
      console.log(publicHeaders.token);
      let httpDefaultOpts = { //http默认配置
        method: opts.method,
        url: opts.url,
        timeout: 30000,
        params: opts.data,
        data: opts.dataType ? opts.data : qs.stringify(opts.data),
        headers: Object.assign(publicHeaders, opts.headers),
      };
      if (opts.method === 'post') {
        delete httpDefaultOpts.params
      } else {
        delete httpDefaultOpts.data
      }
      axios(httpDefaultOpts).then((res) => {
          let data = res.data;
          console.log('---------------------------');
          console.log(opts.url);
          console.log(JSON.stringify(httpDefaultOpts.data));
          console.log(JSON.stringify(res.data));
          console.log('---------------------------');
          switch (data.code) {
            case '00000':
              opts.success(data.data);
              break;
            case '404':
              opts.noFind(data.data);
              break;
            case '40001':
              mui.toast('游客权限失效');
              plus.storage.removeItem(plusKey.temporaryToken);
              httpServer(opts);
              break;
            case '401':
              setTimeout(() => {
                myMethods.openDetail('login')
              }, 500);
              opts.unToken();
              break;
            default:
              mui.toast(data.msg);
              opts.error(data);
          }
        }
      ).catch((error,res) => {
          console.log(error);
          console.log(res);
          if (JSON.stringify(error) === '{}') return;
          if (!error.config) return;
          if (error.response) {
            mui.toast('网络开小差了，请稍候再试~');
            opts.connectionNone();
          } else {
            mui.toast('请求跑到外太空了~');
            opts.connectionNone();
          }
        }
      )
    }
  });
};
export default httpServer
