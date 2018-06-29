<template lang="pug">
  #app
    .mui-content
      loading(ref="loading")
      .content-page
        .scroll-wrapper#page1
          .scroll-box
            .none(v-if="!addressData.data.length && dataLock")
              i.iconfont.icon-Shippingaddress
              span 您还未添加收货地址
            .address-group(v-if="addressData.data.length && dataLock")
              div.address-box(v-for="item in addressData.data")
                i.iconfont.select(:class="item.defaulted ? 'icon-selectss':'icon-CIRCLE'", @tap="changeDefault(item.rid,!item.defaulted)")
                .address-content
                  .address-top
                    .fun-name {{item.contact_name}}
                    .fun-group
                      i.iconfont.icon-Rubbish(@tap="delAddress(item.rid,item)")
                      i.iconfont.icon-edit(@tap="openDetail('address_edit',{item:item})")
                  .address-tel {{item.contact_tel}}
                  .address-location {{item.province}}{{item.city}}
                  .address-location {{item.district}}{{item.street}}
      button.fixed-bottom-btn(@tap="openDetail('address_edit_new')") 新增收货地址
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
        dataLock: false,
        addressData: {
          pageNum: 1,
          data: []
        }
      }
    },
    mounted() {
      let vueThis = this;
      this.getData()
      window.addEventListener('editSuccess', (e) => {
        mui.toast(e.detail.msg);
        this.getData()
      });
      window.addEventListener('getData', () => {
        this.getData();
        mui.preload({
          url: './address_edit.html',
          id: 'address_edit'
        });
        mui.preload({
          url: './address_edit_new.html',
          id: 'address_edit_new'
        });
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.dataLock = false;
        this.$refs.loading.show();
        this.addressData = {
          pageNum: 1,
          data: {}
        };
        http({
          url: api.member_address,
          success: (data) => {
            this.addressData.data = data.result || [];
            this.$refs.loading.hide();
            this.dataLock = true;
            mui('#page1').pullRefresh().scrollTo(0, 0, 100)
          },
          noFind: () => {

          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,//跳转详情
      openDetail:myMethods.openNViewPreload,
      delAddress(id,item) {
        let rid = id;
        mui.confirm('确定删除该地址', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_address,
              method: 'delete',
              data: {rid: rid},
              success: (data) => {
                this.getData();
                mui.toast('删除成功~')
              }
            })
          }
        }, 'div')
      },//修改默认地址
      changeDefault(id) {
        http({
          url: api.member_address_default,
          method: 'post',
          data: {
            rid: id
          },
          success:()=> {
            mui.toast('修改默认地址成功~');
            this.getData();
          }
        })
      }
    }
  }
</script>
