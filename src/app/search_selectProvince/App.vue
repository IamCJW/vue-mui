<template lang="pug">
  #app
    .mui-content.bg-gary
      .indexed-list
        .indexed-content(ref='indexed')
          .indexed-list-alert(v-show="alertFlag.code") {{alertFlag.letter}}
          .indexed-list-bar
            a(v-for="item in letter" @tap="chooseGroup(item)") {{item}}
          .indexed-list-inner
            .indexed-table-view
              li.indexed-list-group(v-for="(item,key) in nation" :data-group="key") {{key}}
                div.indexed-item(v-for="p in item" :class="{active:p.name === province}" @tap="selectLocation(p.name,p.short_name)") {{p.name}}
</template>
<style lang="stylus" scoped>
  @import "selectProvince.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {lsKey} from "../../assets/js/locationStorage";
  import myMethods from '../../assets/js/methods'

  export default {
    name: 'selectlocation',
    data() {
      return {
        province: '',//当前选择
        nationData: [],//初始数据
        letter: [],//城市首字母
        nation: {},//城市分类数据
        alertFlag: {//字母标签
          code: false,
          letter: ''
        },
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nationData = JSON.parse(localStorage.getItem(lsKey.nationData));
          this.nationData.forEach((item) => {
            if (this.letter.indexOf(item.prefix) === (-1)) {
              this.letter.push(item.prefix)
            }
          });
          this.letter = this.letter.sort();
          this.letter.forEach((item) => {
            let _item = item;
            this.nation[_item] = [];
            this.nationData.forEach((item) => {
              if (item.prefix === _item) {
                this.nation[_item].push(item)
              }
            })
          });
        } else {
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
                this.nation[_item] = [];
                data.forEach((item) => {
                  if (item.prefix === _item) {
                    this.nation[_item].push(item)
                  }
                })
              });
            }
          });
        }
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
      //选择器选择///////////////////////////////////////////////////
      selectLocation(name, shortName) {
        this.province = name;
        let view = plus.webview.currentWebview().opener();
        myMethods.muiFireLock(view,()=>{
          mui.fire(view, 'chooseProvince', {
            province: {
              name: name,
              shortName: shortName
            }
          });
        });
        mui.back()
      },
    },
    mounted() {
      mui.init({});
      this.getNation();
      window.addEventListener('localStorageClear', () => {
        this.getNation();
      });
    }
  }
</script>
