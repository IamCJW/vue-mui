<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 资质设置
    .mui-content
      .selected-content
        .selected-title
          span 已选资质
          i.fr.iconfont.icon-Rubbish(@tap="deleteAll")
            span 全部清空
        ul.media-view
          li.media(v-for="(item,index) in selectedArr")
            .media-content
              span {{item.one === '建筑业施工企业资质'? '施工资质' : item.one}}-{{item.two}}-{{item.three}}-{{item.four}}
              i.iconfont.icon-Rubbish.fr(@tap="deleteArr(index)")
      .button-group
        button(@tap="add") 添加资质
        button(@tap="submitBack") 完成选择
    .typeGroup(v-if="selectFlag")
      .typeItem(v-for="(item,key) in qualifyList", :class="{active:qualifyFlag === key}", @tap="changeQualify(key)") {{item === '建筑业施工企业资质'? '施工资质' : item}}

</template>
<style lang="stylus">
  @import "selectQualify.styl"
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
        selectedArrOver:[],
        qualifyFlag: '1',
        qualifyList: {
          1: '建筑业施工企业资质',
          2: '设计资质',
          3: '勘察资质',
          4: '监理资质',
          5: '一体化资质',
        },
        picker: {},
        qualityData: {},
        old_back: {},
      }
    },
    mounted() {
      let vueThis = this;
      mui.init({});
      this.getNation();
      mui('body').on('tap', '.mui-poppicker-btn-cancel,.mui-backdrop', () => {
        vueThis.selectFlag = false;
      });
      window.addEventListener('localStorageClear',()=>{
        this.getNation();
      });
      mui.plusReady(() => {
        plus.key.addEventListener('backbutton', function () {
            vueThis.selectFlag = false;
          }
        );
      });
      if (this.selectedArr.length === 0) {
        this.add();
      }
    },
    methods: {
      //资质设置内容/////////////////////////////////////////////////////////////////
      getNation() {
        this.picker = new mui.PopPicker({
          layer: 3
        });
        if (localStorage.getItem(lsKey.qualify) !== null) {
          this.qualifyData = JSON.parse(localStorage.getItem(lsKey.qualify));
          this.qualifyData.forEach((item)=>{
            if(item.text === '建筑业施工企业资质'){
              this.picker.setData(item.children);
            }
          });
        } else {
          http({
            url: api.common_base_qualify,
            success: (data) => {
              this.qualifyData = data;
              data.forEach((item)=>{
                if(item.text === '建筑业施工企业资质'){
                  this.picker.setData(item.children);
                }
              });
              localStorage.setItem(lsKey.qualify,JSON.stringify(data));
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
      deleteArr(index, id) {
        this.selectedArr.splice(index, 1);
        this.selectedArrOver.splice(index, 1);
      }
      ,
      //删除全部//////////////////////
      deleteAll() {
        this.selectedArr = [];
        this.selectedArrOver= [];
      }
      ,//确定回调函数
      selectSuccess(items) {
        this.selectFlag = false;
        let item = {
          one: this.qualifyList[this.qualifyFlag],
          two: items[0].text,
          three: items[1].text,
          four: items[2].text,
          id: items[2].value,
        };
        if (JSON.stringify(this.selectedArrOver).indexOf(JSON.stringify(items[1].text)) === -1) {
          this.selectedArr.unshift(item);
          this.selectedArrOver.unshift(items[1].text);
        } else {
          mui.toast('请勿重复添加')
        }
      },
      submitBack() {
        let categoryData = this.selectedArr;
        let view = plus.webview.currentWebview().opener();
        myMethods.muiFireLock(view,()=>{
          mui.fire(view, 'chooseCategory', {
            categoryData: categoryData
          });
        });
        mui.back();
      }
    }
  }
</script>
