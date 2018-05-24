<template lang="pug">
  #app
    header.header-nav-search
      span.mui-action-back.iconfont.icon-return
      .search-input
        i.iconfont.icon-SEARCH
        input(placeholder="请输入要查询的项目")
      span.search 搜索
    .mui-content
      .pro-group.cell-row
        .pro-item
          .pro-assist
            div
              i.iconfont.icon-SUPERVISION
              | 监理摸
            div
              i.iconfont.icon-SUPERVISION
              | 监理
          .pro-main
            .pro-name 江西省赣州经济技术开发区保障性安居工程与标准厂房app项目监理公式
</template>
<style lang="stylus" scoped>
  @import "searchProject.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import axios from 'axios'
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import api from '../../assets/js/api'

  export default {
    name: 'searchProject',
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
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        let _this = this;
        axios.get(`${api.baseApi}${api.apiList.nation}`)
          .then(function (response) {
            let data = response.data.data;
            _this.nationData = data;
            data.forEach((item) => {
              if (_this.letter.indexOf(item.prefix)) {
                _this.letter.push(item.prefix)
              }
            });
            _this.letter = _this.letter.sort();
            _this.letter.forEach((item) => {
              let _item = item;
              _this.nation[_item] = [];
              data.forEach((item) => {
                if (item.prefix === _item) {
                  _this.nation[_item].push(item)
                }
              })
            });
            _this.selectInit();
          })
          .catch(function (error) {
            console.log(error);
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
      //选择器初始化//////////////////////////////////////////////////////
      selectInit() {
        let locationSel = this.nation[this.letter[0]][0];
      },
      //数据初始化////////////////////////////////////////////////////
      dataInit() {
        let province = localStorage.getItem(lsKey.locationProvince);
        let city = localStorage.getItem(lsKey.locationCity);
        let district = localStorage.getItem(lsKey.locationDistrict);
        this.location = `${province} / ${city} / ${district}`
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
            this.location = `${this.province} / ${this.city} / ${this.district}`;
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
            this.location = `${this.province} / ${this.city} / ${this.district}`;
            break;
          case 3:
            this.district = key;
            this.location = `${this.province} / ${this.city} / ${this.district}`;
            //将定位存入本地缓存
            localStorage.setItem(lsKey.locationProvince, this.province);
            localStorage.setItem(lsKey.locationCity, this.city);
            localStorage.setItem(lsKey.locationDistrict, this.district);
            mui.back();
        }
      },
    },
    mounted() {
      mui.init({
        beforeback: function(){
          //获得列表界面的webview
          let home = plus.webview.getWebviewById('home');
          //触发列表界面的自定义事件（refresh）,从而进行数据刷新
          mui.fire(home,'refresh');
          //返回true，继续页面关闭逻辑
          return true
        }
      });
      this.dataInit();
      this.getNation();
    }
  }
</script>
