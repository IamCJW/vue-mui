const prefix = 'http://106.14.201.3:8080/mockjsdata/1'; // api地址前缀
export default (config => {
  let copy = {};
  for (let key in config) {
    copy[key] = `${prefix}${config[key]}`;
  }
  return copy
})
({
  home: '/index/home',//首页初始化数据
  nation: '/common/nation',//地址三级联动
  tender_success:'/project/tender_success',//中标公示分页数据
  tender:'/project/tender',//招标公告分页数据
  tender_more:'/project/tender/more',//更多招标信息分页数据
  tender_subscribe:'/project/tender/subscribe',//订阅分页数据
})
