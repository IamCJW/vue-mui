<template lang="pug">
  #app
    .mui-content
      .selected-content
        .selected-title
          span 已选资质
          span.fr 手动最多添加5条资质
        ul.media-view
          li.media(v-for="item in selectedArr")
            .media-content
              span {{item.name}}—{{item.level}}
              i.iconfont.icon-Rubbish.fr(v-if="item.type === 1",@tap="deleteArr(item.rid)")
    button.fixed-bottom-btn(@tap="add") 添加
    .typeGroup(v-if="selectFlag")
      .typeItem(v-for="(item,key) in qualifyList", :class="{active:qualifyFlag === key}", @tap="changeQualify(key)") {{item === '建筑业施工企业资质'? '施工资质' : item}}
</template>
<style lang="stylus">
  @import "selectQualifys.styl"
  .typeGroup
    position fixed
    bottom 2.4rem
    background $main-color-x
    z-index 9999999
    width 100%
    overflow auto
    .typeItem
      width 20%
      float left
      text-align center
      line-height .5rem
      border-top .02rem solid transparent
      color #fff
      &.active
        border-color $third-color
  .mui-pciker-list li
    font-size .12rem
    display-flex()
    flex-align-item(center)
    flex-justify-content(center)
    line-height .18rem
    white-space inherit
  .mui-poppicker-body
    .mui-picker:last-child
      width 20%!important
    .mui-picker:nth-child(2)
      width 50%!important
    .mui-picker:nth-child(1)
      width 30%!important
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {lsKey} from "../../assets/js/locationStorage";
  import myMethods from "../../assets/js/methods";

  export default {
    name: 'selectQualify',
    data() {
      return {
        selectFlag: false,
        selectedArr: [],
        qualifyFlag: '1',
        qualifyList: {
          1: '建筑业施工企业资质',
          2: '设计资质',
          3: '勘察资质',
          4: '监理资质',
          5: '一体化资质',
        },
        picker: {show: {}},
        qualityData: {}
      }
    },
    mounted() {
      window.addEventListener('getData', () => {
        this.getData();
        this.getNation();
      });
      window.addEventListener('localStorageClear',()=>{
        this.getNation();
      });
      let vueThis = this;
      mui('body').on('tap', '.mui-poppicker-btn-cancel,.mui-backdrop', () => {
        vueThis.selectFlag = false;
      });
      mui.init({
        beforeback:()=>{
          let view = plus.webview.getWebviewById('userData');
          if(!view)return true;
          myMethods.muiFireLock(view,()=>{
            mui.fire(view, 'chooseQualification', {msg:'修改资质成功'});
          });
          return true;
        }
      });
      mui.plusReady(() => {
        plus.key.addEventListener('backbutton', function () {
            vueThis.selectFlag = false;
          }
        );
      });
    },
    methods: {
      //资质列表
      getData() {
        http({
          url: api.member_qualify,
          success: (data) => {
            this.selectedArr = data;
            if (this.selectedArr.length === 0) {
              this.add();
            }
          }
        })
      },
      //资质设置内容/////////////////////////////////////////////////////////////////
      getNation() {
        this.picker = new mui.PopPicker({
          layer: 3
        });
        if (localStorage.getItem(lsKey.qualify) !== null) {
          this.qualifyData = JSON.parse(localStorage.getItem(lsKey.qualify));
          for (let i in this.qualifyData) {
            if (this.qualifyData[i].text === this.qualifyList[1]) {
              this.picker.setData(this.qualifyData[i].children);
            }
          }
        } else {
          http({
            url: api.common_base_qualify,
            success: (data) => {
              this.qualifyData = data;
              for (let i in this.qualifyData) {
                if (this.qualifyData[i].text === this.qualifyList[1]) {
                  this.picker.setData(this.qualifyData[i].children);
                }
              }
              localStorage.setItem(lsKey.qualify, JSON.stringify(data));
            },
            error: (data) => {

            }
          });
        }
      },
      //添加///////////////////////////////////////
      add() {
        this.selectFlag = true;
        let vueThis = this;
        this.picker.show(function (items) {
          if (!items[2].value) {
            mui.toast('请等待数据加载完成');
            return false
          }
          vueThis.selectSuccess(items);
        });
      },
      changeQualify(key) {
        let vueThis = this;
        if (!this.qualifyData) {
          mui.toast('正在加载数据，请稍候切换');
          return
        }
        this.qualifyFlag = key;
        for (let i in this.qualifyData) {
          if (this.qualifyData[i].text === this.qualifyList[key]) {
            this.picker.dispose();
            this.picker = new mui.PopPicker({
              layer: 3
            });
            this.picker.setData(this.qualifyData[i].children);
            this.picker.show(function (items) {
              vueThis.selectSuccess(items);
            })
          }
        }
      },
      //删除///////////////////////
      deleteArr(id) {
        let vueThis = this;
        let rid = id;
        mui.confirm('确认删除该资质？', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_qualify,
              method: 'delete',
              data: {rid: rid},
              success: () => {
                vueThis.getData();
                mui.toast('资质删除成功');
              }, error: (data) => {

              }
            })
          }
        }, 'div');
      },
      //确定///////////////////////
      confirm() {
        mui.back()
      },//确定回调函数
      selectSuccess(items) {
        this.selectFlag = false;
        http({
          url: api.member_qualify,
          method: 'post',
          data: {rid: items[2].value},
          success: () => {
            this.getData();
            mui.toast('资质添加成功');
            let view = plus.webview.getWebviewById('subscription_selectQualification');
            myMethods.muiFireLock(view,()=>{
              mui.fire(view,'qualifysUpdata',{
                msg:'资质数据更新'
              })
            });
          },
          error: (data) => {

          }
        })
      }
    }
  }
</script>
