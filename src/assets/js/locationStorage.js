// 地址定位

let lsKey = {
  locationOldSelect:'localStorage_location_old_select',//历史选择定位
  locationProvince: 'localStorage_location_province',//定位的省
  locationCity: 'localStorage_location_city',//定位的市
  locationDistrict: 'localStorage_location_district',//定位的区
  filterProvince: 'localStorage_filter_province',//筛选的省
  filterCity: 'localStorage_filter_city',//筛选的省
  filterDistrict: 'localStorage_filter_district',//筛选的省
  nationData:'localStorage_naiton_data',//城市数据
  qualify:'localStorage_qualify',//资质数据
  userMobile:'localStorage_user_mobile',//用户绑定手机
};
let ssKey = {
  locationProvince: 'localStorage_location_province',//定位的省
  locationCity: 'localStorage_location_city',//定位的市
  locationDistrict: 'localStorage_location_district',//定位的区
  filterProvince: 'localStorage_filter_province',//筛选的省
  filterCity: 'localStorage_filter_city',//筛选的省
  filterDistrict: 'localStorage_filter_district',//筛选的省
};
let plusKey = {
  firstOpen:'first_open',//应用是否第一次启动
  token:'token',//登录标识
  state:'state',//登录状态
  temporaryToken:'temporary_token',//临时的标识
  clientid:'clientid',//推送标识
};



export {lsKey, ssKey , plusKey}
