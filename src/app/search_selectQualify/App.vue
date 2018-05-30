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
      .select-content
        .select-show
          i.iconfont.icon-down
        .select-group
          .select-item.category-content
            ul
              li(v-for="item in categoryData" :class="{active:item.category === category}" @tap="select(item.category,1)") {{item.category}}
          .select-item.qualify-content
            ul
              li(v-for="item in qualifyData" :class="{active:item.name === qualify}" @tap="select(item.name,2)") {{item.name}}
          .select-item.level-content
            ul
              li(v-for="item in levelData"  :class="{active:item.level === level}" @tap="select(item.level,3)") {{item.level}}
        .select-btnGroup
          button(@tap="add") 添加
          button 确定
</template>
<style lang="stylus" scoped>
  @import "selectQualify.styl"
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
        category: '',
        qualify: '',
        level: '',
        categoryData: [],
        qualifyData: [],
        levelData: [],
        selectedArr: [],
      }
    },
    methods: {
      //资质设置内容/////////////////////////////////////////////////////////////////
      getNation() {
        http({
          url: api.common_base_qualify,
          success: (data) => {
            console.log(data);
            this.categoryData = data;
            this.qualifyData = this.categoryData[0].qualify_list;
            this.levelData = this.qualifyData[0].level_list;
            this.category = this.categoryData[0].category;
            this.qualify = this.qualifyData[0].name;
            this.level = this.levelData[0].level;
          }
        });
      },
      //选择资质///////////////////////////////////////////////////
      select(key, type) {
        switch (type) {
          case 1:
            this.category = key;
            this.categoryData.forEach((item) => {
              if (item.category === key) {
                this.qualifyData = item.qualify_list;
                return;
              }
            });
            this.levelData = this.qualifyData[0].level_list;
            this.qualify = this.qualifyData[0].name;
            this.level = this.levelData[0].level;
            break;
          case 2:
            this.qualify = key;
            this.qualifyData.forEach((item) => {
              if (item.name === key) {
                this.levelData = item.level_list;
                return;
              }
            });
            this.level = this.levelData[0].level;
            break;
          case 3:
            this.level = key;
            break;
        }
      },
      //添加///////////////////////////////////////
      add() {
        let item = {
          category: this.category,
          level: this.level,
          name: this.qualify
        };
        if (JSON.stringify(this.selectedArr).indexOf(JSON.stringify(item)) === -1) {
          this.selectedArr.unshift(item)
        } else {
          mui.toast('请勿重复添加')
        }
      },
      //删除///////////////////////
      deleteArr(index){
        this.selectedArr.splice(index,1)
      },
      //删除全部//////////////////////
      deleteAll(){
        this.selectedArr=[];
      },
      //确定///////////////////////
      confirm(){
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
