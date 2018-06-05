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
              span {{item.category}}-{{item.name}}-{{item.level}}
              i.iconfont.icon-Rubbish.fr(@tap="deleteArr(index)")
      .button-group
        button.add(@tap="add") 添加
        .tip 手动最多添加5条资质
    .typeGroup
      .typeItem(v-for="(item,key) in qualifyList", :class="{active:qualifyFlag === key}", @tap="changeQualify(key)") {{item}}

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

  export default {
    name: 'selectQualify',
    data() {
      return {
        selectedArr: [],
        qualifyFlag:'1',
        qualifyList:{
          1:'施工资质',
          2:'设计资质',
          3:'勘察资质',
          4:'监理资质',
          5:'一体化资质',
        },
        picker:{}
      }
    },
    methods: {
      //资质设置内容/////////////////////////////////////////////////////////////////
      getNation() {

      },
      //选择资质///////////////////////////////////////////////////
      select(key, type) {

      },
      //添加///////////////////////////////////////
      add() {
        http({
          url: api.common_base_qualify,
          success: (data) => {
            this.picker = new mui.PopPicker({
              layer: 3
            });
            this.picker.setData(data);
            this.picker.show(function (items) {
              console.log(items)
            });
          }
        });
        // let item = {
        //   category: this.category,
        //   level: this.level,
        //   name: this.qualify
        // };
        // if (JSON.stringify(this.selectedArr).indexOf(JSON.stringify(item)) === -1) {
        //   this.selectedArr.unshift(item)
        // } else {
        //   mui.toast('请勿重复添加')
        // }
      },
      changeQualify(key){
        this.qualifyFlag = key;
        http({
          url: api.common_base_qualify,
          data:{
            category:this.qualifyList[key]
          },
          success: (data) => {
            console.log(data);
            this.picker.dispose();
            this.picker = new mui.PopPicker({
              layer: 3
            });
            this.picker.setData(data);
            this.picker.show(function (items) {
              console.log(items)
            });
          }
        });
      },
      //删除///////////////////////
      deleteArr(index) {
        this.selectedArr.splice(index, 1)
      },
      //删除全部//////////////////////
      deleteAll() {
        this.selectedArr = [];
      },
      //确定///////////////////////
      confirm() {
        let categoryData = this.selectedArr;
        let view = plus.webview.currentWebview().opener();
        mui.fire(view, 'chooseCategory', {
          categoryData: categoryData
        });
        mui.back()
      }
    },
    mounted() {
      mui.init({});
      this.getNation();
    }
  }
</script>
