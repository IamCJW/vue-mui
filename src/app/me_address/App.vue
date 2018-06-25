<template lang="pug">
  #app
    .mui-content
      loading(ref="loading")
      .content-page
        .scroll-wrapper#page1
          .scroll-box
            .address-group
              div.address-box(v-for="item in addressData.data")
                i.iconfont.select(:class="item.defaulted ? 'icon-selectss':'icon-CIRCLE'", @tap="changeDefault(item.rid,!item.defaulted)")
                .address-content
                  .address-top
                    .fun-name {{item.contact_name}}
                    .fun-group
                      i.iconfont.icon-Rubbish(@tap="delAddress(item.rid)")
                      i.iconfont.icon-edit(@tap="openDetail('address_edit',{item:item})")
                  .address-tel {{item.contact_tel}}
                  .address-location {{item.province}}{{item.city}}
                  .address-location {{item.district}}{{item.street}}
      button.fixed-bottom-btn(@tap="openWindow('address_edit_new')") 新增收货地址
</template>
<style lang="stylus" scoped>
  @import "address.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import loading from '../../components/loading'

  export default {
    name: 'addressManage',
    components: {loading},
    data() {
      return {
        addressData: {
          pageNum: 1,
          data: {}
        }
      }
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('editSuccess', (e) => {
        mui.toast(e.detail.msg);
        this.getData()
      });
      window.addEventListener('getData', () => {
        this.getData();
        mui.preload({
          url:'./address_edit.html',
          id:'address_edit'
        });
        mui.preload({
          url:'./address_edit_new.html',
          id:'address_edit_new'
        });
        mui.init({
          pullRefresh: [{
            container: '#page1',
            up: {
              contentrefresh: "正在加载...",
              callback: function () {
                vueThis.addressData.pageNum += 1;
                http({
                  url: api.member_address,
                  data: {
                    province: vueThis.province,
                    cur_page: vueThis.addressData.pageNum
                  }, success: (data) => {
                    vueThis.addressData.data = vueThis.addressData.data.concat(data.result);
                    if (data.total_page === vueThis.addressData.pageNum) {
                      this.endPullupToRefresh(true);
                    } else {
                      this.endPullupToRefresh(false);
                    }
                  }
                });
              }
            }
          }]
        })
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        this.addressData = {
          pageNum: 1,
          data: {}
        };
        http({
          url: api.member_address,
          success: (data) => {
            this.addressData.data = data.result;
            this.$refs.loading.hide();
            mui('#page1').pullRefresh().scrollTo(0,0,100)
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail(url, data) {
        mui.plusReady(function () {
          let detailPage = plus.webview.getWebviewById(url);
          if (!detailPage) {
            mui.toast('目标正在初始化，请稍候~')
          }
          mui.fire(detailPage, 'getData', data);
          myMethods.openWindow(url);
        });
      },
      delAddress(id) {
        mui.confirm('确定删除该地址', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_address,
              method: 'post',
              data: {rid: id},
              success: (data) => {
                this.getData()
              }
            })
          }
        },'div')
      },//修改默认地址
      changeDefault(id, value) {
        http({
          url: api.member_address_default,
          method: 'post',
          data: {
            defaulted: value,
            rid: id
          },
          success() {
            this.getData();
          }
        })
      }
    }
  }
</script>
