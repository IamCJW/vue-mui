<template lang="pug">
  #app
    .mui-content
      .header-login
        i.iconfont.icon-sdf.mui-action-back
      .box
        .nav-tab
          .nav-item(:class="{'active':loginType}", @tap="changeType(true)") 新用户
          .nav-item(:class="{'active':!loginType}", @tap="changeType(false)") 老用户
        .input-group
          .input-item
            i.iconfont.icon-shouji
            input(placeholder="请输入手机号" type="tel" maxlength="11" v-model="phone" @input="changePhone")
            span.code(:class="{disabled:codeFlag}" @tap="getCode") {{codeText}}
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" maxlength="11"  v-model="code")
          .input-item(v-if="!loginType")
            button(@tap="bind") 绑定
          template(v-if="loginType")
            .input-item
              i.iconfont.icon-yanzhengma
              input(placeholder="请输入密码" type="password" v-model="pwd", maxlength="16")
            .input-item
              i.iconfont.icon-yanzhengma
              input(placeholder="请确认密码" type="password" v-model="pwd1", maxlength="16")
            .input-item
              button(@tap="register") 注册
</template>
<style lang="stylus" scoped>
  @import "login_other.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'loginOther',
    data() {
      return {
        loginType: true,
        phone: '',
        code: '',
        pwd: '',
        pwd1: '',
        codeFlag: true,
        codeText: '获取验证码',
        totalTime: '60',
        flag: '',
        openid: '',
        clientid:'',
        os_type:'',
        nick_name:'',
        icon:'',
      }
    },
    mounted() {
      let vueThis = this;
      mui.plusReady(()=>{
        vueThis.clientid = plus.storage.getItem(plusKey.clientid);
        mui.os.android ? this.os_type = 1 : '';
        mui.os.ios ? this.os_type = 2 : '';
      });
      window.addEventListener('getData', (e) => {
        this.flag = e.detail.flag;
        this.openid = e.detail.openid;
        this.icon=e.detail.icon;
        this.nick_name=e.detail.nick_name;
      })
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
        if (this.codeFlag) {
          mui.toast('手机号错误');
          return
        }
        if (myMethods.regexPhone(this.phone) && !this.codeFlag) {
          this.codeFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            data: {
              mobile_no: this.phone,
              type:1,
            },
            method: 'post',
            success: () => {
              mui.toast('获取成功')
            }
          })
        }
      },// 验证码定时器
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
      //打开页面
      openWindow: myMethods.openWindow,
      //改变登录方式
      changeType(boolean) {
        this.loginType = boolean;
      },
      // 注册////////////////////////////////
      register() {
        let vueThis = this;
        if (this.pwd === '' || this.pwd1 === '') {
          mui.toast('密码不能为空');
          return
        }
        if(!myMethods.regexPwd(vueThis.passwordOne)){
          mui.toast('请输入8到16位包含字母与数字的密码~');
          return
        }
        if (this.pwd !== this.pwd1) {
          mui.toast('密码输入不一致');
          return
        }
        http({
          url: api.user_auth_register,
          data: {
            mobile: this.phone,
            flag:this.flag,
            pwd: this.pwd,
            code:this.code,
            openid:this.openid,
            getui_id:this.clientid,
            os_type:this.os_type,
            nick_name:this.nick_name,
            icon:this.icon,
          },
          type:true,
          method: 'post',
          success:(data)=> {
            this.successDo(data);
            myMethods.statistics(1);
          }
        })
      },
      bind(){
        http({
          url: api.user_auth_bind,
          data: {
            mobile: this.phone,
            flag:this.flag,
            code:this.code,
            openid:this.openid,
            getui_id:this.clientid,
            os_type:this.os_type
          },
          method: 'post',
          type:true,
          success:(data)=> {
            this.successDo(data);
          }
        })
      },
      //成功登录操作
      successDo(data){
        plus.storage.setItem(plusKey.token, data);
        plus.storage.setItem(plusKey.state, "true");
        let view = plus.webview.getWebviewById('me');
        let viewMes = plus.webview.getWebviewById('message');
        myMethods.muiFireLock(view,()=>{
          mui.fire(view, 'loginSuccess', {
            msg: '登录成功'
          });
        });
        myMethods.muiFireLock(viewMes,()=>{
          mui.fire(viewMes, 'loginSuccess', {
            msg: '登录成功'
          });
        });
        let loginView = plus.webview.getWebviewById('login');
        let login_otherView = plus.webview.getWebviewById('login_other');
        loginView.close();
        login_otherView.close();
        myMethods.statistics(2);
      }
    }
  }
</script>
