<template lang="pug">
  #app
    .mui-content
      loading(ref="loading")
      warn(v-if="connectionState", :remakeDo="true")
      template(v-if="dataLock && subscriptionData.data.length === 0")
        warn(icon="icon-subscription" , msg="暂无订阅信息，请先添加订阅~")
        button.mid-btn(@tap="openNViewPreload('subscription_add')") 添加订阅
      .content-wrapper(v-show="dataLock && subscriptionData.data.length !== 0")
        .mui-wrapper#page1
          .mui-scroll
            .content
              ul.media-view
                li.media.media-more(v-for="(item,index) in subscriptionData.data")
                  .media-content
                    .media-lable
                      span 订阅{{index+1}}
                    .media-del
                      i.iconfont.icon-Rubbish(@tap="subscriptionDel(item.id)")
                      switchBox(:status="switchData[item.id]", :key-name="item.id", @changeStatus="upStatus")
                  .media-alert
                    ul.media-view
                      li.media(@tap="chooseLocation(item)")
                        .media-content.iconfont.icon-right {{item.province+item.city+item.district}}
                      li.media.border-none(@tap="openNViewPreload('subscription_selectQualification',item)")
                        .media-content.iconfont.icon-right
                          .qualify-group
                            .qualify-title
                              span 订阅资质
                            .qualify-item(v-for="quanilify in item.quanlify_info")
                              span {{quanilify.category+quanilify.name}}-{{quanilify.level}}
        .fixed-bottom-btn(@tap="openNViewPreload('subscription_add')") 添加订阅
</template>
<style lang="stylus" scoped>
  @import "subscription.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'
  import loading from '../../components/loading'
  import {lsKey} from "../../assets/js/locationStorage";
  import warn from "../../components/warn"

  export default {
    name: 'subscription',
    data() {
      return {
        dataLock: false,
        subscriptionData: {
          pageNum: 1,
          data: []
        },
        switchData: {},
        nationData:[],
      }
    },
    components: {
      switchBox: switchBox,
      loading: loading,
      warn:warn,
    },
    mounted() {
      window.addEventListener('getData', () => {
        this.getData();
        myMethods.uploadReset('#page1');
        this.subscriptionData.pageNum = 1;
      });
      window.addEventListener('chooseQualification', (e) => {
        this.getData();
        mui.toast(e.detail.msg);
      });
      window.addEventListener('addSuccess', (e) => {
        this.getData();
        myMethods.uploadReset('#page1');
        this.subscriptionData.pageNum = 1;
        mui.toast(e.detail.msg);
      });
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.subscriptionData.pageNum += 1;
              http({
                url: api.member_subscribe,
                data: {
                  cur_page: vueThis.subscriptionData.pageNum
                }, success: (data) => {
                  if (data.total_page < vueThis.subscriptionData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.subscriptionData.data = vueThis.subscriptionData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                connectionNone:()=>{
                  vueThis.subscriptionData.pageNum -= 1;
                  this.endPullupToRefresh(false);
                }
              });
            }
          }
        }]
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.member_subscribe,
          success: (data) => {
            this.subscriptionData = {
              pageNum: 1,
              data: []
            };
            this.subscriptionData.data = data.result;
            data.result.forEach((item) => {
              this.$set(this.switchData, `${item.id}`, item.status);
            });
            this.connectionOnline();
            mui('#page1').pullRefresh().scrollTo(0, 0, 100);
          },
          connectionNone: ()=>{
            this.connectionUnline();
          }
        });
      },
      //更新开关的值
      upStatus(switchData) {
        http({
          url:api.member_subscribe_status,
          method:'post',
          data:{
            id:switchData.key,
            status:switchData.value ? 1 : 0
          },
          success:()=>{
            this.$set(this.switchData, switchData.key, switchData.value);
          },
          error:(data)=>{
            mui.toast(data.msg)
          }
        });
      },
      openWindow: myMethods.openWindow,
      openNViewPreload: myMethods.openNViewPreload,
      //订阅删除
      subscriptionDel(id) {
        mui.confirm('确定删除该订阅？', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_subscribe,
              method: 'delete',
              data: {id: id},
              success: (data) => {
                this.getData();
                mui.toast('删除成功')
              }
            });
          }
        }, 'div');
      },
      //订阅地址修改//////////////////
      chooseLocation(item){
        this.getNation();
        if (this.nationData.length === 0){
          mui.toast('正在初始化数据，请稍候~');
          return
        } else {
          let nationData = this.nationData;
          this.pickerInit(nationData,item);
        }
      },
      //////////////////////////////
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nationData = JSON.parse(localStorage.getItem(lsKey.nationData));
        }else {
          http({
            url: api.nation,
            success: (data) => {
              this.nationData = data;
              localStorage.setItem(lsKey.nationData,JSON.stringify(data));
            }
          });
        }
      },
      //选择器初始化/////////////////////////////////////////////////////////
      pickerInit(data,itemData){
        this.picker = new mui.PopPicker({
          layer: 3
        });
        let setData = [];
        let provinceData = {};
        let cityData = {};
        let districtData = {};
        data.forEach((item) => {
          provinceData = {
            text: item.name,
            value: item.name,
            children: [],
          };
          item.city.forEach((item) => {
            cityData = {
              text: item.name,
              value: item.name,
              children: [],
            };
            item.district.forEach((item) => {
              districtData = {
                text: item.name,
                value:item.name,
              };
              cityData.children.push(districtData);
            });
            provinceData.children.push(cityData);
          });
          setData.push(provinceData);
        });
        let vueThis = this;
        this.picker.setData(setData);
        let provinceSet =  itemData.province;
        let citySet =  itemData.city || '全省';
        let districtSet =  itemData.district;
        if(citySet !== '全省'){
          districtSet = districtSet || '全市';
        }else {
          districtSet = '全省';
        }
        this.picker.pickers[0].setSelectedValue(provinceSet);
        this.picker.pickers[1].setSelectedValue(citySet);
        this.picker.pickers[2].setSelectedValue(districtSet);
        this.picker.show((res)=>{
          let province = res[0].text;
          let city = res[1].text;
          let district = res[2].text;
          if(res[1].text === '全省'){
            city = '';
            district = '';
          }
          if(res[2].text==='全市'){
            district = ''
          }
          http({
            url: api.member_subscribe,
            method: 'post',
            dataType: true,
            data: {
              province: province,
              city: city,
              district: district,
              qualify_info: itemData.qualify_info,
              id: itemData.id
            },
            success:()=> {
              mui.toast('修改成功');
              this.getData();
            }
          });
          vueThis.picker.dispose();
        });
      },
    }
  }
</script>
