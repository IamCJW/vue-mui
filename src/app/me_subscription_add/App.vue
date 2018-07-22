<template lang="pug">
  #app
    .mui-content
      ul.media-view
        li.media(@tap="chooseLocation")
          .media-content.iconfont.icon-right {{location.province ? location.province+location.city+location.district : '请选择订阅区域'}}
        li.media(@tap="openNViewPreload('subscription_selectQualification')")
          .media-content.iconfont.icon-right
            .qualify-group
              .qualify-title
                span 订阅资质选择
              .qualify-item(v-for="item in qualifyList", v-if="selectedQualify[item.rid]")
                span {{item.name}}-{{item.level}}
        li.media
          .media-content.flex
            span.fl 订阅状态{{status ? '已开启' : '已关闭'}}
            switchBox.fr(:status="status", :key-name="'status'", @changeStatus="upStatus")
      .fixed-bottom-btn(@tap="save") 保存
</template>
<style lang="stylus" scoped>
  @import "subscription_add.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'
  import {lsKey} from "../../assets/js/locationStorage";

  export default {
    name: 'subscription_add',
    data() {
      return {
        noneData: false,//判断是否有值
        status: true,
        location: {},
        chooseQualification: [],
        selectedQualify: {},
        qualifyList: [],
      }
    },
    components: {
      switchBox: switchBox,
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData',()=>{
        this.location={};
        this.chooseQualification=[];
        this.selectedQualify={};
      });
      window.addEventListener('chooseQualification', (e) => {
        vueThis.chooseQualification = e.detail.data;
        vueThis.selectedQualify = e.detail.selectedQualify;
        console.log(JSON.stringify(e.detail));
      });
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_qualify,
          success: (data) => {
            this.qualifyList = data;
          }
        });
      },//更新开关的值
      upStatus(data) {
        this[data.key] = data.value
      },
      save() {
        http({
          url: api.member_subscribe,
          method: 'post',
          dataType: true,
          data: {
            province: this.location.province,
            city: this.location.city,
            district: this.location.district,
            qualify_info: this.chooseQualification
          },
          success: () => {
            let view = plus.webview.currentWebview().opener();
            myMethods.muiFireLock(view,()=>{
              mui.fire(view, 'addSuccess', {
                msg: '添加成功'
              });
            });
            mui.back();
          }
        })
      },
      openNViewPreload: myMethods.openNViewPreload,
      //订阅地址修改//////////////////
      chooseLocation(item) {
        this.getNation();
        if (this.nationData.length === 0) {
          mui.toast('正在初始化数据，请稍候~');
          return
        } else {
          let nationData = this.nationData;
          this.pickerInit(nationData, item);
        }
      },
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nationData = JSON.parse(localStorage.getItem(lsKey.nationData));
        } else {
          http({
            url: api.nation,
            success: (data) => {
              this.nationData = data;
              localStorage.setItem(lsKey.nationData, JSON.stringify(data));
            }
          });
        }
      },
      //选择器初始化/////////////////////////////////////////////////////////
      pickerInit(data, itemData) {
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
            value: item.code,
            children: [],
          };
          item.city.forEach((item) => {
            cityData = {
              text: item.name,
              value: item.code,
              children: [],
            };
            item.district.forEach((item) => {
              districtData = {
                text: item.name,
              };
              cityData.children.push(districtData);
            });
            provinceData.children.push(cityData);
          });
          setData.push(provinceData);
        });
        let vueThis = this;
        this.picker.setData(setData);
        this.picker.show((res) => {
          let province = res[0].text;
          let city = res[1].text;
          let district = res[2].text;
          if (res[1].text === '全省') {
            city = '';
            district = '';
          }
          if (res[2].text === '全市') {
            district = ''
          }
          vueThis.location={
           province:province,
           city:city,
           district:district
          };
          vueThis.picker.dispose();
        });
      }
    }
  }
</script>
