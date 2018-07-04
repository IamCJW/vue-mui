<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="地区搜索")
      span.search 搜索
    .mui-content.bg-gary
      .selected-box
        span 当前选择
        span {{location}}
      .oldSelect-box
        .oldSelect-title 最近访问
        .oldSelect-group
          span.border-box(v-for="item in oldSelects" @tap="selectLocationOld(item.province,item.city,item.district)") {{item.province}}{{item.city}}{{item.district}}
      .indexed-list
        .indexed-content(ref='indexed')
          .indexed-list-alert(v-show="alertFlag.code") {{alertFlag.letter}}
          .indexed-list-bar
            a(v-for="item in letter" @tap="chooseGroup(item)") {{item}}
          .indexed-list-inner
            .indexed-table-view
              li.indexed-list-group(v-for="(item,key) in nation" :data-group="key") {{key}}
                div.indexed-item(v-for="p in item" :class="{active:p.name === province}" @tap="selectLocation(p.name,1)") {{p.name}}
            .indexed-table-view-child
              .indexed-child-group
                div.indexed-item(v-for="item in provinceSel.city" :class="{active:item.name === city}" @tap="selectLocation(item.name,2)") {{item.name}}
              .indexed-child-group
                div.indexed-item(v-for="item in citySel.district" :class="{active:item.name === district}" @tap="selectLocation(item.name,3)") {{item.name}}

</template>
<style lang="stylus" scoped>
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
        letter: [],//城市首字母
        nation: {},//城市分类数据
        alertFlag: {//字母标签
          code: false,
          letter: ''
        },
        provinceSel: '',//选择的省数据
        citySel: '',//选择的市数据
        province: '',//选择的省
        city: '',//选择的市
        district: '',//选择的区
        oldSelects: [],//最近访问
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        http({
          url: api.nation,
          success: (data) => {
            this.nationData = data;
            data.forEach((item) => {
              if (this.letter.indexOf(item.prefix) === (-1)) {
                this.letter.push(item.prefix)
              }
            });
            this.letter = this.letter.sort();
            this.letter.forEach((item) => {
              let _item = item;
              let cityArr = [];
              data.forEach((item) => {
                if (item.prefix === _item) {
                  cityArr.push(item)
                }
              });
              this.$set(this.nation, _item, cityArr);
            });
            this.selectLocation(localStorage.getItem(lsKey.locationProvince), 1);
            this.selectLocation(localStorage.getItem(lsKey.locationCity), 2);
            this.selectLocation(localStorage.getItem(lsKey.locationDistrict), 4);
          }
        });
      },
      //地址选择锚点定位//////////////////////////////////////////
      chooseGroup(type) {
        this.alertFlag.code = true;
        this.alertFlag.letter = type;
        let scrollTop = document.querySelector(`[data-group=${type}]`);
        let indexTop = document.querySelector('.indexed-list-inner');
        indexTop.scrollTop = scrollTop.offsetTop;
        setTimeout(() => {
          this.alertFlag.code = false;
        }, 200)
      },
      //数据初始化////////////////////////////////////////////////////
      dataInit() {
        let province = localStorage.getItem(lsKey.locationProvince);
        let city = localStorage.getItem(lsKey.locationCity);
        let district = localStorage.getItem(lsKey.locationDistrict);
        this.location = `${province}${city}${district}`;
        this.oldSelects = localStorage.getItem(lsKey.locationOldSelect) ? JSON.parse(localStorage.getItem(lsKey.locationOldSelect)) : [];
      },
      //选择器选择///////////////////////////////////////////////////
      selectLocation(key, type) {
        console.log(key);
        console.log(type);
        switch (type) {
          case 1:
            this.province = key;
            this.city = '';
            this.district = '';
            this.citySel = '';
            this.nationData.map((item) => {
              if (item.name === this.province) {
                this.provinceSel = item;
                return
              }
            });
            this.location = `${this.province}`;
            break;
          case 2:
            if (key === '全省') {
              this.city = key;
              this.citySel = [];
              if( this.district !== '全市'){
                this.district = '';
              }
              this.selectedDo();
              return
            }
            this.city = key;
            this.district = '';
            let cityArr = this.provinceSel.city;
            cityArr.map((item) => {
              if (item.name === this.city) {
                this.citySel = item;
                return
              }
            });
            this.location = `${this.province}${this.city}`;
            break;
          case 3:
            if (key === '全市') {
              this.district = key;
              this.selectedDo();
              return
            }
            this.district = key;
            this.location = `${this.province}${this.city}${this.district}`;
            this.selectedDo();
            break;
          case 4:
            this.district = key;
            this.location = `${this.province}${this.city}${this.district}`;
        }
      },
      //选择完成执行///////////////////////////////////////////////
      selectedDo() {
        let province = this.province;
        let city = this.city === '全省' ? '' : this.city;
        let district = this.district === '全市' ? '' : this.district;
        //将定位存入本地缓存
        localStorage.setItem(lsKey.locationProvince, province);
        localStorage.setItem(lsKey.locationCity, city);
        localStorage.setItem(lsKey.locationDistrict, district);
        //历史查询存入缓存
        if (this.oldSelects.length < 1) {
          this.oldSelects.unshift({province: province, city: city, district: district})
        }
        let flag = false;
        this.oldSelects.forEach((item) => {
          if (!(item.district === this.district && item.city === this.city && item.province === this.province)) {
            flag = true
          }
        });
        if(flag){
          if (this.oldSelects.length < 3) {
            this.oldSelects.unshift({province: province, city: city, district: district});
            console.log(this.oldSelects)
          } else {
            console.log(this.oldSelects)
            this.oldSelects.unshift({province: province, city: city, district: district});
            this.oldSelects.pop();
            console.log(this.oldSelects)
          }
        }
        localStorage.setItem(lsKey.locationOldSelect, JSON.stringify(this.oldSelects));
        mui.plusReady(() => {
          let view = plus.webview.getWebviewById('home');
          mui.fire(view, 'changeLocation', {
            province: province,
            city: city,
            district: district,
          });
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
        mui.back();
      }
    },
    mounted() {
      mui.init({});
      this.dataInit();
      this.getNation();
      window.addEventListener('localStorageClear', () => {
        this.dataInit();
        this.getNation();
      })
    }
  }
</script>
