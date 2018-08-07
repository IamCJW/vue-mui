<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 地址编辑
    .mui-content
      ul.media-view
        li.media
          .media-content.iconfont
            .media-lable 收货人
            .media-value
              input(type="text",placeholder='请输入名字', v-model="contact_name")
        li.media
          .media-content.iconfont
            .media-lable 手机号码
            .media-value
              input(placeholder='请输入手机号',type="tel", v-model="contact_tel")
        li.media
          .media-content.iconfont.icon-right(@tap="selectCity")
            .media-lable 所在城市
            .media-value {{ province+city+district || '请选择城市'}}
        li.media
          .media-content
            .media-lable 详细地址
            .media-value
              input(type="text",placeholder='请输入详细地址', v-model="street")
      .setDefult
        .setDefult-msg
          .title 设置默认地址
          .tip 下单时默认使用该地址
        .switch(:class="{active : defaulted}", @tap="changeDefault")
          .switch-handle
    button.fixed-bottom-btn(@tap="addressSave") 保存
</template>
<style lang="stylus" scoped>
  @import "address_edit.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'addressmanageedit',
    data() {
      return {
        city: '',
        contact_name: '',
        contact_tel: '',
        district: '',
        province: '',
        street: '',
        defaulted: 0,
        rid:'',
        cityPicker:{}
      }
    },
    mounted() {
      window.addEventListener('getData',(e)=>{
        let data = e.detail.item;
        this.rid = data.rid;
        this.city=data.city;
        this.contact_name=data.contact_name;
        this.contact_tel=data.contact_tel;
        this.district=data.district;
        this.province=data.province;
        this.street=data.street;
        this.defaulted=data.defaulted;
      });
      this.cityPicker = new mui.PopPicker({
        layer: 3
      });
      this.cityPicker.setData(cityData3);
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {

      },//打开页面
      openWindow: myMethods.openWindow,
      //更改默认地址
      changeDefault() {
        this.defaulted = !this.defaulted
      },//选择城市
      selectCity(){
        let vueThis = this;
        this.cityPicker.show(function(items) {
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
          rid:this.rid
        };
        for (let item in data){
          if (data[item] === ''){
            mui.toast('所有选项不能为空~');
            return
          }
        }
        http({
          url:api.member_address,
          dataType:true,
          data:data,
          method:'post',
          success:()=>{
            let view = plus.webview.currentWebview().opener();
            myMethods.muiFireLock(view,()=>{
              mui.fire(view, 'editSuccess', {
                msg: '修改成功'
              });
            });
            mui.back();
          }
        })
      }
    }
  }
</script>
