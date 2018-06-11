<template lang="pug">
  #app
    .mui-content
      .box
        .logo
          img(src="../../assets/logo.png")
        .input-group
          .input-item
            i.iconfont.icon-shouji
            input(placeholder="请输入手机号" type="tel" maxlength="11" v-model="phone" @input="changePhone")
            span.code(:class="{disabled:codeFlag}" @tap="getCode") {{codeText}}
          .input-item(v-if="!loginType")
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" maxlength="11"  v-model="code")
          .input-item(v-if="loginType")
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入密码" type="password" v-model="pwd")
            span.code.disabled 忘记密码？
          .input-item
            button(@tap="login") 登录
          .input-item.other
            span(@tap="changType") 短信验证码登录
            span(@tap="openWindow('regist')") 新用户注册
        .login-third
          .title 其他登录方式
          .content
            i.iconfont.icon-WECHAT
            i.iconfont.icon-QQFRIENDS
        .tip 登录代表您已经同意
          a 《用户协议》
          | 和
          a 《隐私政策》
</template>
<style lang="stylus" scoped>
  @import "login.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'login',
    data() {
      return {
        loginType: false,
        phone: '',
        code: '',
        pwd: '',
        codeFlag: true,
        codeText:'获取验证码',
        totalTime:'10'
      }
    },
    mounted() {

    },
    created() {

    },
    methods: {
      changePhone() {
        if (myMethods.regexPhone(this.phone)) {
          this.codeFlag = false
        } else {
          this.codeFlag = true
        }
      },
      //获取验证码
      getCode() {
        if (myMethods.regexPhone(this.phone) && !this.codeFlag) {
          this.codeFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            data: {
              mobile_no: this.phone
            },
            method: 'post',
            success: () => {
              mui.toast('获取成功')
            }
          })
        }
      },// 验证码定时器
      timeClock(){
        this.codeText = `${this.totalTime}s后获取`;
        let clock = window.setInterval(()=>{
          this.totalTime --;
          this.codeText = `${this.totalTime}s后获取`;
          if(this.totalTime < 1){
            window.clearInterval(clock);
            this.codeText='重新获取';
            this.codeFlag=false;
          }
        },1000)
      }
      ,//打开页面
      openWindow: myMethods.openWindow,
      //改变登录方式
      changType() {
        this.loginType = !this.loginType;
      },
      // 登录////////////////////////////////
      login() {
        if (this.phone === '') {
          mui.toast('手机号不能为空');
          return
        }
        if (!myMethods.regexPhone(this.phone)) {
          mui.toast('请输入正确的手机号码！');
          return
        }
        if (this.loginType && (this.pwd === "" || this.pwd.length < 6)) {
          mui.toast('请输入最少8位密码');
          return
        }
        if (this.loginType === false && (this.code === "" || this.code.length !== 4)) {
          mui.toast('请输入4位验证码');
          return
        }
        let data = {
          flag: this.loginType ? 1 : 2,
          mobile: this.phone,
          pwd: this.loginType ? this.pwd : this.code
        };
        http({
          url: api.user_login,
          data: data,
          method: 'post',
          success: () => {
            myMethods.openWindow('./index.html')
          }
        })
      },
    }
  }
</script>
