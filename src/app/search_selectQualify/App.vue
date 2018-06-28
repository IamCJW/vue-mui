<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 资质设置
      span(@tap="submitBack") 确定
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
              i.iconfont.icon-Rubbish.fr(@tap="deleteArr(index,item.id)")
      .button-group
        button.add(@tap="add") 添加
    .typeGroup(v-if="selectFlag")
      .typeItem(v-for="(item,key) in qualifyList", :class="{active:qualifyFlag === key}", @tap="changeQualify(key)") {{item === '建筑业施工企业资质'? '施工资质' : item}}

</template>
<style lang="stylus" scoped>
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
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {lsKey} from "../../assets/js/locationStorage";

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
        picker: {},
        qualityData: {},
        old_back: {},
      }
    },
    mounted() {
      let vueThis = this;
      mui.init({});
      this.old_back = mui.back;
      mui.back = function () {
        let btn = ["确定", "取消"];
        mui.confirm('确定放弃保存所选资质？', ' ', btn, function (e) {
          if (e.index === 0) {
            vueThis.old_back();
          }
        },'div');
      };
      this.getNation();
      mui('body').on('tap', '.mui-poppicker-btn-cancel,.mui-backdrop', () => {
        vueThis.selectFlag = false;
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
          this.picker.setData(this.qualifyData[0].children);
        } else {
          http({
            url: api.common_base_qualify,
            success: (data) => {
              this.qualifyData = data;
              this.picker.setData(this.qualifyData[0].children);
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
        if (!this.qualifyData) {
          mui.toast('正在加载数据，请稍后切换');
          return
        }
        this.qualifyFlag = key;
        for (let i in this.qualifyData) {
          if (this.qualifyData[i].text === this.qualifyList[key]) {
            this.picker.setData(this.qualifyData[i].children);
          }
        }
      },
      //删除///////////////////////
      deleteArr(index, id) {
        mui.confirm('确认删除该资质？', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            this.selectedArr.splice(index, 1);
          }
        },'div');
      }
      ,
      //删除全部//////////////////////
      deleteAll() {
        this.selectedArr = [];
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
        if (JSON.stringify(this.selectedArr).indexOf(JSON.stringify(item)) === -1) {
          this.selectedArr.unshift(item);
        } else {
          mui.toast('请勿重复添加')
        }
      }
      ,
      submitBack() {
        let categoryData = this.selectedArr;
        let view = plus.webview.currentWebview().opener();
        mui.fire(view, 'chooseCategory', {
          categoryData: categoryData
        });
        this.old_back()
      }
    }
  }
</script>
