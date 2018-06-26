import axios from 'axios'
import qs from 'querystring'

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

  opts['method'] = opts.method || 'get';
  let Public = { //公共参数
    'srAppid': ""
  };
  let httpDefaultOpts = { //http默认配置
    method: opts.method,
    url: opts.url,
    timeout: 10000,
    params: Object.assign(Public, opts.data),
    data: qs.stringify(Object.assign(Public, opts.data)),
    headers: opts.method === 'get' ? {
      'X-Requested-With': 'XMLHttpRequest',
      "Accept": "application/json",
      "Content-Type": "application/json; charset=UTF-8"
    } : {
      'X-Requested-With': 'XMLHttpRequest',
      'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'
    }
  };
  if (opts.method === 'get') {
    delete httpDefaultOpts.data
  } else {
    delete httpDefaultOpts.params
  }

  axios(httpDefaultOpts).then((res) => {
    console.log(res);
      let data = res.data;
      if(data.code === '00000'){
        opts.success(data.data);
      }else {
        opts.error(res.data);
      }
    }
  ).catch((response) => {
      if (response) {

      }else{
        mui.toast('请求异常');
      }
    }
  )
};
export default httpServer
