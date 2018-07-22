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
    if (plus.storage.getItem(plusKey.token) === null && plus.storage.getItem(plusKey.temporaryToken) === null) {
      axios.get(api.system_token).then((res) => {
        let data = res.data;
        if (data.code === '00000') {
          plus.storage.setItem(plusKey.temporaryToken, data.data);
          httpServer(opts);
        } else {
          mui.toast('服务器异常');
          return;
        }
      }).catch(() => {
        mui.toast('请求失败？？？');
      })
    } else {
      opts['method'] = opts.method || 'get';
      opts['dataType'] = opts.dataType || false;
      let publicHeaders = {
        "token": plus.storage.getItem(plusKey.token) || plus.storage.getItem(plusKey.temporaryToken),
        // "token": 'eyJhbGciOiJIUzI1NiJ9.eyJqdGkiOiI4Y2RkMmJjMWRkNzU2MGJlMWY1MjBhYzBkNzk3ZTljZiIsImlhdCI6MTUzMTM4MTYwMywic3ViIjoiMjAxODA3MTIxMTU4NTM1NTY1OCIsImlzcyI6ImtiYXBwYmFja2dyb3VkYXBpIiwiaXNHdWVzdCI6ZmFsc2V9.-a_uXcg2VJ2vz9hji2JPtWxkZ18sVza-NfAb80V9vYw',
      };
      let httpDefaultOpts = { //http默认配置
        method: opts.method,
        url: opts.url,
        timeout: 10000,
        params: opts.data,
        data: opts.dataType ? opts.data : qs.stringify(opts.data),
        headers: Object.assign(publicHeaders, opts.headers),
      };
      console.log(opts.url);
      console.log(JSON.stringify(httpDefaultOpts.data));
      if (opts.method === 'post') {
        delete httpDefaultOpts.params
      } else {
        delete httpDefaultOpts.data
      }
      axios(httpDefaultOpts).then((res) => {
          let data = res.data;
          console.log(JSON.stringify(res.data));
          if (data.code === '00000') {
            opts.success(data.data);
          } else if (data.code === '404') {
            opts.noFind(data.data);
          } else if (data.code === '40001') {
            mui.toast('游客权限失效');
            plus.storage.removeItem(plusKey.temporaryToken);
            httpServer(opts);
          }else if(data.code === '401'){
            setTimeout(()=>{myMethods.openDetail('login')},500);
            opts.unToken();
          }else {
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
    }
  });
};
export default httpServer
