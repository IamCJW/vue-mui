<template lang="pug">
  #app
    .mui-content
      .box
        .input-group
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" v-model="code" @input="changeValue")
            span.code(:class="{disabled:codeFlag}", @tap="getCode") {{codeText}}
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入密码", type="password" , minlength="6", v-model="passwordOne", maxlength="16")
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请再次输入", type="password" , minlength="6", v-model="passwordTwo", maxlength="16")
        button.mid-btn(@tap="next") 确认修改
</template>
<style lang="stylus" scoped>
  @import "changePwd.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import myMethods from '../../assets/js/methods'
  import {lsKey} from "../../assets/js/locationStorage";

  export default {
    name: 'changePwd',
    data() {
      return {
        code: '',
        phone: '',
        phoneFlag: false,
        btnDisable: true,
        first: true,
        codeText: '获取验证码',
        totalTime: '60',
        codeFlag: false,
        passwordOne:'',
        passwordTwo:'',
        clientid:'',
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {
      // 验证码定时器
      timeClock() {
        this.codeText = `${this.totalTime}s后获取`;
        let clock = window.setInterval(() => {
          this.totalTime--;
          this.codeText = `${this.totalTime}s后获取`;
          if (this.totalTime < 1) {
            window.clearInterval(clock);
            this.totalTime = 60;
            this.codeText = '重新获取';
            this.codeFlag = false;
          }
        }, 1000)
      },
      // 获取验证码
      getCode() {
        let mobile = localStorage.getItem(lsKey.userMobile);
        if (!this.codeFlag) {
          this.totalTime = 60;
          this.codeFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            method: 'post',
            data: {
              mobile_no: mobile,
              type:3
            },
            success() {
              this.phone = mobile;
              mui.toast('获取成功')
            }
          })
        }
      },//下一步
      next() {
        let vueThis = this;
        if(this.passwordOne === '' || this.passwordTwo === ''){
          mui.toast('密码不能为空');
          return
        }
        console.log(myMethods.regexPwd(vueThis.passwordOne));
        if(!myMethods.regexPwd(vueThis.passwordOne)){
          mui.toast('请输入8到16位包含字母与数字的密码~');
          return
        }
        if(this.passwordOne !== this.passwordTwo){
          mui.toast('密码输入不一致');
          return
        }
        http({
          url: api.member_security_modify_pwd,
          data: {
            code: this.code,
            mobile: this.phone,
            pwd:this.passwordOne
          },
          method: 'post',
          success:()=>{
            mui.toast('修改密码成功~');
          },
          error:(data)=>{
            mui.toast(data.msg)
          }
        })
      },
    }
  }
</script>
