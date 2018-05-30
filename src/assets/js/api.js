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
  tender_success: '/project/tender_success',//中标公示分页数据
  tender_success_detail: "/project/tender_success/detail",//中标公示详情
  tender: '/project/tender',//招标公告分页数据
  tender_id: '/project/tender/detail',//招标公告详情
  tender_more: '/project/tender/more',//更多招标信息分页数据
  tender_subscribe: '/project/tender/subscribe',//订阅分页数据
  common_dict: '/common/dict',//基础数据字典
  search_company: '/search/company',//建筑企业
  search_builder_search: '/search/builder/search',//查找建造师
  common_base_qualify: '/common/base_qualify',//企业资质数据
  search_company_qualify_search: '/search/company/qualify_search',//根据企业资质查找建筑企业
  search_company_detail: '/search/company/detail',//企业详情
})
