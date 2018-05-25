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
          span.border-box(v-for="item in oldSelects" @tap="selectLocationOld(item.province,item.city,item.district)") {{item.city}}{{item.district}}
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
              if (this.letter.indexOf(item.prefix)) {
                this.letter.push(item.prefix)
              }
            });
            this.letter = this.letter.sort();
            this.letter.forEach((item) => {
              let _item = item;
              this.nation[_item] = [];
              data.forEach((item) => {
                if (item.prefix === _item) {
                  this.nation[_item].push(item)
                }
              })
            });
            this.selectInit();
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
        console.log(this.oldSelects)
      },
      //选择器选择///////////////////////////////////////////////////
      selectLocation(key, type) {
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
            this.location = `${this.province}${this.city}${this.district}`;
            break;
          case 2:
            this.city = key;
            this.district = '';
            let cityArr = this.provinceSel.city;
            cityArr.map((item) => {
              if (item.name === this.city) {
                this.citySel = item;
                return
              }
            });
            this.location = `${this.province}${this.city}${this.district}`;
            break;
          case 3:
            this.district = key;
            this.location = `${this.province}${this.city}${this.district}`;
            //将定位存入本地缓存
            localStorage.setItem(lsKey.locationProvince, this.province);
            localStorage.setItem(lsKey.locationCity, this.city);
            localStorage.setItem(lsKey.locationDistrict, this.district);
            //历史查询存入缓存
            if (this.oldSelects.length < 1) {
              this.oldSelects.unshift({province: this.province, city: this.city, district: this.district})
            }
            this.oldSelects.forEach((item) => {
              if (item.district !== this.district) {
                if (this.oldSelects.length < 3) {
                  this.oldSelects.unshift({province: this.province, city: this.city, district: this.district});
                } else {
                  this.oldSelects.shift();
                  this.oldSelects.unshift({province: this.province, city: this.city, district: this.district});
                }
              }
            });
            console.log(this.oldSelects);
            localStorage.setItem(lsKey.locationOldSelect, JSON.stringify(this.oldSelects));
            mui.back();
        }
      },
      //历史记录访问//////////////////////////////////////////
      selectLocationOld(province,city,district){
        //将定位存入本地缓存
        localStorage.setItem(lsKey.locationProvince, province);
        localStorage.setItem(lsKey.locationCity, city);
        localStorage.setItem(lsKey.locationDistrict, district);
        mui.back()
      }
    },
    mounted() {
      mui.init({
        beforeback: function () {
          //获得列表界面的webview
          let home = plus.webview.getWebviewById('home');
          //触发列表界面的自定义事件（refresh）,从而进行数据刷新
          mui.fire(home, 'refresh');
          //返回true，继续页面关闭逻辑
          return true
        }
      });
      this.dataInit();
      this.getNation();
    }
  }
</script>
