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
                div.indexed-item(v-for="p in item" :class="{active:p.name === province}" @tap="selectLocation(p.name,1)") {{p.name}}
            .indexed-table-view-child
              .indexed-child-group
                div.indexed-item(v-for="item in provinceSel.city" :class="{active:item.name === city}" @tap="selectLocation(item.name,2)") {{item.name}}
              .indexed-child-group
                div.indexed-item(v-for="item in citySel.district" :class="{active:item.name === district}" @tap="selectLocation(item.name,3)") {{item.name}}
</template>
<style lang="stylus" scoped>
  @import "subscription_selectLocation.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import myMethods from "../../assets/js/methods";

  export default {
    name: 'subscription_selectLocation',
    data() {
      return {
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
        subscription: '',//订阅内容
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        if (localStorage.getItem(lsKey.nationData) !== null) {
          this.nationData = JSON.parse(localStorage.getItem(lsKey.nationData));
          this.nationData.forEach((item) => {
            if (this.letter.indexOf(item.prefix)) {
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
            break;
          case 3:
            this.district = key;
            console.log(this.subscription.id);
            if (this.subscription.id) {
              http({
                url: api.member_subscribe,
                method: 'post',
                dataType:true,
                data: {
                  province: this.province,
                  city: this.city,
                  district: this.district,
                  qualify_info: this.subscription.qualify_info,
                  rid: this.subscription.id
                },
                success() {
                  let view = plus.webview.getWebviewById('subscription');
                  mui.fire(view, 'chooseLocation', {
                    msg: '修改成功'
                  });
                  mui.back();
                }
              })
            } else {
              let view = plus.webview.getWebviewById('subscription_add');
              let vueThis = this;
              mui.fire(view, 'chooseLocation', {
                location: {
                  province: vueThis.province,
                  city: vueThis.city,
                  district: vueThis.district
                }, msg: ""
              });
              mui.back();
            }
        }
      },
    },
    mounted() {
      window.addEventListener('getData', (e) => {
        this.subscription = e.detail;
        this.getNation();
      });
    }
  }
</script>
