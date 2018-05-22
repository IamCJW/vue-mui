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
        span.border-box 赣州市(章贡区)
      .oldSelect-box
        .oldSelect-title 最近访问
        .oldSelect-group
          span.border-box 深圳
          span.border-box 赣州市(章贡区)
          span.border-box 广东
      .indexed-list
        .indexed-content(ref='indexed')
          .indexed-list-alert(v-show="alertFlag.code") {{alertFlag.letter}}
          .indexed-list-bar
            a(v-for="item in letter" @tap="chooseGroup(item)") {{item}}
          .indexed-list-inner
            .indexed-table-view
              li.indexed-list-group(v-for="(item,key) in nation" :data-group="key") {{key}}
                div.indexed-item(v-for="p in item") {{p.name}}
</template>
<style lang="stylus" scoped>
  @import "selectLocation.styl"
</style>
<script>
  /* global mui */
  import axios from 'axios'
  import api from '../../assets/js/api'

  export default {
    name: 'selectlocation',
    data() {
      return {
        letter: [],
        nation: {},
        alertFlag: {
          code: false,
          letter: ''
        }
      }
    },
    methods: {
      //获取地址信息/////////////////////////////////////////////////////////////////
      getNation() {
        let _this = this;
        axios.get(`${api.baseApi}${api.apiList.nation}`)
          .then(function (response) {
            let data = response.data.data;
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
          })
          .catch(function (error) {
            console.log(error);
          });
      },
      chooseGroup(type) {
        console.log(type)
        this.alertFlag.code = true;
        this.alertFlag.letter = type;
        let scrollTop = document.querySelector("[data-group="+type+"]");
        this.$refs.indexed.scrollTop = `${scrollTop.offsetTop}px`;
        setTimeout(() => {
          this.alertFlag.code = false;
        }, 500)
      }
    },
    mounted() {
      mui.init();
      this.getNation();
    }
  }
</script>
