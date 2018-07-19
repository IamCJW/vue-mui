<template lang="pug">
  #app
    .mui-content.bg-gary
      .selected-box
        span 当前选择
        span {{location}}
      .oldSelect-box
        .oldSelect-title 最近访问
        .oldSelect-group
          span.border-box(v-for="item in oldSelects" @tap="selectLocationOld(item.province,item.city,item.district)") {{item.province}}{{item.city}}{{item.district}}
      .indexed-list

</template>
<style lang="stylus">
  @import "selectLocation.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'selectlocation',
    data() {
      return {
        location: '',//当前选择
        nationData: [],//初始数据
        province: '',//选择的省
        city: '',//选择的市
        district: '',//选择的区
        oldSelects: [],//最近访问
        picker: {},
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nationData = JSON.parse(localStorage.getItem(lsKey.nationData));
          this.pickerInit(this.nationData);
        }else {
          http({
            url: api.nation,
            success: (data) => {
              this.nationData = data;
              localStorage.setItem(lsKey.nationData,JSON.stringify(data));
              this.pickerInit(this.nationData);
            }
          });
        }
      },
      //选择器初始化/////////////////////////////////////////////////////////
      pickerInit(data){
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
        this.picker.show((res)=>{
          console.log(res);
          vueThis.province = res[0].text;
          vueThis.city = res[1].text;
          vueThis.district = res[2].text;
          if(res[1].text === '全省'){
            vueThis.city = '';
            vueThis.district = '';
          }
          if(res[2].text ==='全市'){
            vueThis.district = ''
          }
          vueThis.selectedDo();
        });
      },
      //数据初始化////////////////////////////////////////////////////
      dataInit() {
        let province = localStorage.getItem(lsKey.locationProvince);
        let city = localStorage.getItem(lsKey.locationCity);
        let district = localStorage.getItem(lsKey.locationDistrict);
        this.location = `${province}${city}${district}`;
        this.oldSelects = localStorage.getItem(lsKey.locationOldSelect) ? JSON.parse(localStorage.getItem(lsKey.locationOldSelect)) : [];
      },
      //选择完成执行///////////////////////////////////////////////
      selectedDo() {
        let province = this.province;
        let city = this.city === '全省' ? '' : this.city;
        let district = (this.district === '全市' || this.district === '全省'|| this.district === '省本级'|| this.district === '省农垦' ) ? '' : this.district;
        //将定位存入本地缓存
        localStorage.setItem(lsKey.locationProvince, province);
        localStorage.setItem(lsKey.locationCity, city);
        localStorage.setItem(lsKey.locationDistrict, district);
        //历史查询存入缓存
        if (this.oldSelects.length < 1) {
          this.oldSelects.unshift({province: province, city: city, district: district})
        }
        let flag = true;
        this.oldSelects.forEach((item) => {
          if (item.district === district && item.city === city && item.province === this.province) {
            flag = false
          }
        });
        if (flag) {
          if (this.oldSelects.length < 3) {
            this.oldSelects.unshift({province: province, city: city, district: district});
          } else {
            this.oldSelects.unshift({province: province, city: city, district: district});
            this.oldSelects.pop();
          }
        }
        let vueThis = this;
        localStorage.setItem(lsKey.locationOldSelect, JSON.stringify(this.oldSelects));
        mui.plusReady(() => {
          let view = plus.webview.getWebviewById('home');
          mui.fire(view, 'changeLocation', {
            province: province,
            city: city,
            district: district,
          });
          vueThis.picker.dispose();
          mui.back();
        });
      },
      //历史记录访问//////////////////////////////////////////
      selectLocationOld(province, city, district) {
        //将定位存入本地缓存
        localStorage.setItem(lsKey.locationProvince, province);
        localStorage.setItem(lsKey.locationCity, city);
        localStorage.setItem(lsKey.locationDistrict, district);
        let view = plus.webview.getWebviewById('home');
        mui.fire(view, 'changeLocation', {
          province: province,
          city: city,
          district: district,
        });
        this.picker.dispose();
        mui.back();
      }
    },
    mounted() {
      let vueThis =this;
      mui.plusReady(() => {
        plus.key.addEventListener('backbutton', function () {
          vueThis.picker.dispose();
          mui.back();
          }
        );
      });
      mui('body').on('tap','.mui-poppicker-btn-cancel',()=>{
        vueThis.picker.dispose();
        mui.back();
      });
      window.addEventListener('getData',()=>{
        this.dataInit();
        this.getNation();
      });
      mui.init({
        beforeback: () => {
          vueThis.picker.dispose();
          return true;
        }
      })
    }
  }
</script>
