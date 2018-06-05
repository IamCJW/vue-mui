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
  index_project_search:'/index/project/search',//项目搜索
  common_dict: '/common/dict',//基础数据字典
  search_company: '/search/company',//建筑企业
  search_builder_search: '/search/builder/search',//查找建造师
  common_base_qualify: '/common/base_qualify',//企业资质数据
  search_company_qualify_search: '/search/company/qualify_search',//根据企业资质查找建筑企业
  search_company_detail: '/search/company/detail',//企业详情
  search_company_legal: '/search/company/legal',//企业法律诉讼数据分页
  search_company_tender_success: '/search/company/tender_success',//企业中标信息数据分页
  search_company_builder: '/search/company/builder',//企业建造师数据分页
  search_builder_detail: '/search/builder/detail',//建造师详情
  search_builder_tender_success:'/search/builder/tender_success',//建造师中标数据分页
  message_del:'/message/del',//消息删除
  message_subscribe_notify:'/message/subscribe_notify',//关注提醒列表
  message_system_notify:'/message/system_notify',//系统通知列表
  member_icon:'/member/icon',//修改头像
  member_info:'/member/info',//账号信息
  common_search_company:'/common/search_company',//按关键字搜索企业信息
})
