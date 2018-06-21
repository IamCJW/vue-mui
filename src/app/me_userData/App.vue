<template lang="pug">
  #app
    .mui-content
      ul.media-view
        li.media
          .media-content 个人资料
        li.media
          .media-content.iconfont.icon-right
            .media-lable 头像
            .media-value
              .user-head
                img(:src="userHeadSrc")
                input(type='file', accept='image/png,image/jpeg,image/jpg', ref='imgFile' , @change="headChange($event)" )
        li.media
          .media-content
            .media-lable 姓名
            .media-value
              input(placeholder='请输入姓名', v-model='name')
        li.media(@tap="changeGender")
          .media-content.iconfont.icon-right
            .media-lable 性别
            .media-value {{ gender || '请选择性别' }}
      ul.media-view
        li.media
          .media-content 公司信息
        li.media
          .media-content.iconfont.icon-right(@tap="openWindow('userData_company')")
            .media-lable 公司名称
            .media-value {{company_info.name || '公司名字设置'}}
        li.media
          .media-content.iconfont.icon-right(@tap="openWindow('selectQualifys')")
            .media-lable 资质条件
            .media-value 条件设置
        li.media
          .media-content
            .media-lable 担任职位
            .media-value
              input(placeholder='请输入职位', v-model="company_info.title")
        li.media
          .media-content
            .media-lable 固定电话
            .media-value
              input(placeholder='请输入电话', v-model="company_info.tel")
      button.mid-btn(:tap="saveBase") 保存
    .mask(v-if='headEdit')
      .popout
        vueCropper(ref="cropper", :fixed="option.fixed", :fixedNumber="option.fixedNumber", :img="option.img", :info="option.info", :autoCrop="option.autoCrop", :autoCropWidth="option.autoCropWidth", :canMove="option.canMove", :autoCropHeight="option.autoCropHeight", :outputSize="option.size", :outputType="option.outputType")
        button.saveHead(@tap="saveHead") 保存
        button.saveHead.back(@tap="saveHeadBack") 取消
</template>
<style lang="stylus" scoped>
  @import "userData.styl"

</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import Cropper from 'vue-cropper'

  export default {
    name: 'userData',
    data() {
      return {
        imgFile:{},
        userHeadSrc: 'https://gss0.baidu.com/-vo3dSag_xI4khGko9WTAnF6hhy/zhidao/pic/item/a2cc7cd98d1001e92c517af6b30e7bec55e797dd.jpg',
        name: '',
        gender: '',
        company_info: {
          name: '',
          tel: '',
          title: ''
        },
        headEdit: false,//头像列表
        option: {
          img: '',
          size: 0.8,
          outputType: 'png',
          autoCrop: true,
          autoCropWidth: 200,
          autoCropHeight: 200,
          info: false,
          fixedNumber: [1, 1],
          fixed: true
        }
      }
    },
    components: {
      vueCropper: Cropper
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData',(e)=>{
        this.getData();
        myMethods.NVpreload(['userData_company','selectQualifys']);
      });
      window.addEventListener('chooseCompany',(e)=>{
        vueThis.company_info.name = e.detail.data.name;
      })
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_info,
          success: (data) => {
            this.name = data.name;
            this.userHeadSrc = data.icon;
            this.gender = data.gender;
            this.company_info = data.company_info;
          }
        })
      },//打开页面
      openWindow: myMethods.openWindow,
      //头像保存
      saveHead() {
        this.$refs.cropper.getCropData((data) => {
          this.userHeadSrc = data;
        });
        this.$refs.cropper.getCropBlob((data) => {
          this.headEdit = false;
          let formData = new FormData();
          formData.append('file_upload', data);
          http({
            url: api.member_icon,
            method: 'post',
            data: formData,
            success: () => {
              mui.toast('修改头像成功')
            }
          })
        })
      },//更换头像
      headChange(e) {
        let vueThis = this;
        let uploadFile = e.target.files[0];
        let reader = new FileReader();
        reader.readAsDataURL(uploadFile);
        reader.onloadend = function () {
          vueThis.option.img = reader.result;
          vueThis.headEdit = true;
          vueThis.$refs.imgFile.value = '';
        };
      },saveHeadBack(){
        this.headEdit = false;
      },
      //修改性别
      changeGender() {
        let vueThis = this;
        let changSex = new mui.PopPicker();
        changSex.setData([{value:'1',text:'男'},{value:'0',text:'女'}]);
        changSex.show(function(items) {
          vueThis.gender = items[0].text;
        });
      },//保存基本信息
      saveBase(){
        http({
          url:api.member_info,
          method:'post',
          data:{
            gender:this.gender,
            name:this.company_info.name,
            tel:this.company_info.tel,
            title:this.company_info.title,
            user_name:this.name
          },
          success:()=>{
            mui.toast('保存成功')
          }
        })
      },
    }
  }
</script>
