<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 新用户注册
    .mui-content
      .box
        .input-group
          .input-item
            i.iconfont.icon-shouji
            input(placeholder="请输入手机号" type="tel" maxlength="11" v-model="phone" @input="changeValue")
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" v-model="code" @input="changeValue")
            span.code(:class="{disabled:codeFlag}", @tap="getCode") {{codeText}}
        .tip(v-show="phoneFlag") 我们已给手机号码
          span {{phone}}
          | 发送了一条4位数验证码
        .tip(v-show="!phoneFlag") 请输入11位手机号码
        .input-group
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入密码", type="password" , minlength="6", v-model="passwordOne", maxlength="16")
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请再次输入", type="password" , minlength="6", v-model="passwordTwo", maxlength="16")
        button.mid-btn(@tap="next" :disabled="btnDisable" :class="{disabled:btnDisable}") 注册
</template>
<style lang="stylus" scoped>
  @import "regist.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'login',
    data() {
      return {
        code: '',
        phone: '',
        phoneFlag: false,
        btnDisable: true,
        first: true,
        codeText: '重新获取',
        totalTime: '60',
        codeFlag: true,
        passwordOne:'',
        passwordTwo:'',
        clientid:'',
        os_type:'',
      }
    },
    mounted() {
      mui.os.ios ? this.os_type = 1 : this.os_type = 2;
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {

      },//打开页面
      openWindow: myMethods.openWindow,
      changeValue() {
        if (myMethods.regexPhone(this.phone) && this.first) {
          this.first = false;
          this.phoneFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            method: 'post',
            data: {
              mobile_no: this.phone,
              type:1,
            },
            success() {
              mui.toast('获取成功')
            }
          })
        } else {
          this.phoneFlag = false;
        }
        if (myMethods.regexPhone(this.phone) && this.code.length === 4) {
          this.btnDisable = false;
        } else {
          this.btnDisable = true
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
      // 获取验证码
      getCode() {
        if (!this.codeFlag) {
          this.totalTime = 60;
          this.codeFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            method: 'post',
            data: {
              mobile_no: this.phone,
              type:1,
            },
            success() {
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
        if(!myMethods.regexPwd(vueThis.passwordOne)){
          mui.toast('请输入8到16位包含字母与数字的密码~');
          return
        }
        if(this.passwordOne !== this.passwordTwo){
          mui.toast('密码输入不一致');
          return
        }
        http({
          url: api.user_register,
          data: {
            code: this.code,
            mobile: this.phone,
            pwd:this.passwordOne
          },
          method: 'post',
          success:()=>{
            mui.toast('注册成功，正在为您登录');
            this.getClientid();
            http({
              url: api.user_login,
              data: {
                flag: 1,
                mobile: this.phone,
                pwd: this.passwordOne,
                getui_id: this.clientid,
                os_type: this.os_type,
              },
              method:'post',
              success:(data)=>{
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
                let registView = plus.webview.getWebviewById('regist');
                loginView.close();
                registView.close();
                myMethods.statistics(2);
              },
              error:()=>{
                mui.toast('登录出错，请自行登录~');
                let registView = plus.webview.getWebviewById('regist');
                registView.close();
                myMethods.statistics(2);
              }
            });
            myMethods.statistics(1);
          },
          error:(data)=>{

          }
        })
      },
      //获取应用唯一标识
      getClientid() {
        if (plus.storage.getItem(plusKey.clientid)) {
          this.clientid = plus.storage.getItem(plusKey.clientid);
        } else {
          this.clientid = plus.push.getClientInfo().clientid;
          plus.storage.setItem(plusKey.clientid, this.clientid);
        }
        if(!this.clientid){
          this.getClientid();
        }
      }
    }
  }
</script>
