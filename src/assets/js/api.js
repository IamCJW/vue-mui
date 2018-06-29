// const prefix = 'http://106.14.201.3:8080/mockjsdata/1'; // mock地址
const prefix = 'http://192.168.50.26:8080/api';//本地测试地址
// const prefix = 'http://192.168.50.26';//本地测试地址
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
  project_relation_info_detail: "/project/relation_info/detail",//其他内容详情
  tender: '/project/tender',//招标公告分页数据
  tender_id: '/project/tender/detail',//招标公告详情
  tender_more: '/project/tender/more',//更多招标信息分页数据
  tender_subscribe: '/project/tender/subscribe',//订阅分页数据
  index_project_search: '/index/project/search',//项目搜索
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
  search_builder_tender_success: '/search/builder/tender_success',//建造师中标数据分页
  message_del: '/message/del',//消息删除
  message_subscribe_notify: '/message/subscribe_notify',//关注提醒列表
  message_system_notify: '/message/system_notify',//系统通知列表
  member_icon: '/member/icon',//修改头像
  member_info: '/member/info',//账号信息
  member_qualify: '/member/qualify',//添加经营资质post,删除经营资质delete
  common_search_company: '/common/search_company',//按关键字搜索企业信息
  member_address: '/member/address',//get 主页 post 添加或修改收货地址 delete 删除收货地址
  member_address_detail: '/member/address/detail',//地址详情
  member_coupon: '/member/coupon',//优惠券
  member_follow: '/member/follow',//我的关注主页 get post delete
  member_follow_tender: '/member/follow/tender',//关注业主分页
  member_follow_company: '/member/follow/company',//关注企业分页
  member_follow_builder: '/member/follow/builder',//关注建造师分页
  member_follow_project: '/member/follow/project',//关注项目分页
  search_tender_company_detail: '/search/tender/company/detail',//业主单位详情
  search_tender_company_list: '/search/tender/company/list',//业主单位详情招标数据分页
  search_tender_company: '/search/tender/company',//查找业主单位
  member_order_company: '/member/order_company',//订单公司信息管理 get delete post
  member_system_config: '/member/system/config',//系统设置 get post
  member_app_check_version: '/member/app/check_version',//APP版本检查
  user_login: '/user/login',//用户登录
  user_register: '/user/register',//用户注册
  user_auth: '/user/auth',//第三方登录
  user_auth_register: '/user/auth/register',//第三方登录用户注册
  user_auth_bind: '/user/auth/bind',//第三方账号登录绑定
  common_sendcode: '/common/sendcode',//获取验证码
  common_verify_code: '/common/verify_code',//验证码验证
  member_subscribe: '/member/subscribe',//订阅管理
  member_advice_wrong: '/member/advice/wrong',//信息报错
  member_advice: '/member/advice',//意见提交
  member_wallet: '/member/wallet',//我的钱包
  member_wallet_list: '/member/wallet/list',//消费明细分页
  member_address_default: '/member/address/default',//修改默认地址
  system_check_version: '/system/check_version',//版本检查
  system_token: '/system/token',//游客token
  member_logout:'/member/logout',//退出登录
})
