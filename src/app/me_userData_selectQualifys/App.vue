<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 资质设置
    .mui-content
      .selected-content
        .selected-title
          span 已选资质
        ul.media-view
          li.media(v-for="item in selectedArr")
            .media-content
              span {{item.name}}-{{item.level}}
              i.iconfont.icon-Rubbish.fr(@tap="deleteArr(item.rid)")
      .button-group(v-if="selectedArr.length < 5")
        button.add(@tap="add") 添加
        .tip 手动最多添加5条资质
    .typeGroup(v-if="selectFlag")
      .typeItem(v-for="(item,key) in qualifyList", :class="{active:qualifyFlag === key}", @tap="changeQualify(key)") {{item === '建筑业施工企业资质'? '施工资质' : item}}

</template>
<style lang="stylus" scoped>
  @import "selectQualifys.styl"
  .typeGroup
    position fixed
    bottom 2rem
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
  import axios from 'axios'

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
        qualityData: {}
      }
    },
    mounted() {
      mui.init({});
      this.getData();
      this.getNation();
      let vueThis = this;
      mui('body').on('tap', '.mui-poppicker-btn-cancel,.mui-backdrop', () => {
        vueThis.selectFlag = false;
      })
    },
    methods: {
      //资质列表
      getData() {
        http({
          url: api.member_qualify,
          success: (data) => {
            console.log(data);
            this.selectedArr = data;
          }
        })
      },
      //资质设置内容/////////////////////////////////////////////////////////////////
      getNation() {
        this.picker = new mui.PopPicker({
          layer: 3
        });
        http({
          url: api.common_base_qualify,
          success: (data) => {
            this.qualifyData = data;
            this.picker.setData(this.qualifyData[0].children);
          }
        });
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
      deleteArr(id) {
        mui.confirm('确认删除该资质？', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_qualify,
              method: 'delete',
              data: {rid: id},
              success: () => {
                this.getData();
                mui.toast('资质删除成功');
              }
            })
          }
        });
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
          }
        })
      }
    }
  }
</script>
