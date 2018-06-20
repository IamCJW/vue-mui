<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 新增地址
    .mui-content
      ul.media-view
        li.media
          .media-content.iconfont
            .media-lable 收货人
            .media-value
              input(placeholder='请输入名字', v-model="contact_name")
        li.media
          .media-content.iconfont
            .media-lable 手机号码
            .media-value
              input(placeholder='请输入手机号', v-model="contact_tel")
        li.media
          .media-content.iconfont.icon-right(@tap="selectCity")
            .media-lable 所在城市
            .media-value {{ province+city+district || '请选择城市'}}
        li.media
          .media-content
            .media-lable 详细地址
            .media-value
              input(placeholder='请输入详细地址', v-model="street")
      .setDefult
        .setDefult-msg
          .title 设置默认地址
          .tip 下单时默认使用该地址
        .switch(:class="{active : defaulted}", @tap="changeDefault")
          .switch-handle
    button.fixed-bottom-btn(@tap="addressSave") 保存
</template>
<style lang="stylus" scoped>
  @import "address_edit_old.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'addressmanageeditold',
    data() {
      return {
        city: '',
        contact_name: '',
        contact_tel: '',
        district: '',
        province: '',
        street: '',
        defaulted: false,
        cityPicker:{}
      }
    },
    mounted() {
      this.cityPicker = new mui.PopPicker({
        layer: 3
      });
      this.cityPicker.setData(cityData3);
    },
    created() {

    },
    methods: {
      //打开页面
      openWindow: myMethods.openWindow,
      //更改默认地址
      changeDefault() {
        this.defaulted = !this.defaulted
      },//选择城市
      selectCity(){
        let vueThis = this;
        this.cityPicker.show(function(items) {
          console.log(items)
          vueThis.province = items[0].text;
          vueThis.city = items[1].text;
          vueThis.district = items[2].text;
        });
      },
      //保存
      addressSave(){
        let data = {
          city: this.city,
          contact_name: this.contact_name,
          contact_tel: this.contact_tel,
          district: this.district,
          province: this.province,
          street: this.street,
          defaulted: this.defaulted,
        };
        for (let item in data){
          if (data[item] === ''){
            mui.toast('所有选项不能为空~');
            return
          }
        }
        http({
          url:api.member_address,
          data:data,
          method:'post',
          success:()=>{
            let view = plus.webview.currentWebview().opener();
            mui.fire(view, 'editSuccess', {
              msg: '新增成功'
            });
            mui.back();
          }
        })
      }
    }
  }
</script>
