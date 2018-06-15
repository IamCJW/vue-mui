<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 收货地址管理
    .mui-content
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
                      i.iconfont.icon-edit(@tap="openWindow('address_edit',{item:item})")
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

  export default {
    name: 'addressManage',
    data() {
      return {
        addressData: {
          pageNum: 1,
          data: {}
        }
      }
    },
    mounted() {
      window.addEventListener('editSuccess',(e)=>{
        mui.toast(e.detail.msg);
        this.getData()
      });
      this.getData();
      let vueThis = this;
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
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.addressData = {
          pageNum: 1,
          data: {}
        }
        http({
          url: api.member_address,
          success: (data) => {
            this.addressData.data = data.result;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      delAddress(id) {
        mui.confirm('确定删除该地址', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_address,
              method:'post',
              data: {rid: id},
              success: (data) => {
                this.getData()
              }
            })
          }
        })
      },//修改默认地址
      changeDefault(id,value){
        http({
          url:api.member_address_default,
          method:'post',
          data:{
            defaulted:value,
            rid:id
          },
          success(){
            this.getData();
          }
        })
      }
    }
  }
</script>
