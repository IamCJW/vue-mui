<template lang="pug">
  #app
    .mui-content
      .header-login
        i.iconfont.icon-sdf.mui-action-back
      .box
        .logo
          img(src="../../assets/logo.png")
        .input-group
          .input-item
            i.iconfont.icon-shouji
            input(placeholder="请输入手机号" type="tel" maxlength="11" v-model="phone" @input="changePhone")
            span.code(:class="{disabled:codeFlag}" @tap="getCode" v-if="!loginType") {{codeText}}
          .input-item(v-if="!loginType")
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" maxlength="11"  v-model="code")
          .input-item(v-if="loginType")
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入密码" type="password" v-model="pwd")
          .input-item
            button(@tap="login") 登录
          .input-item.other
            span(@tap="changType") {{loginType ? '短信验证码登录': '账号密码登录'}}
            span(@tap="openWindow('regist')") 新用户注册
        .login-third
          .title 其他登录方式
          .content
            i.iconfont.icon-WECHAT(@tap="otherLogin('weixin')")
            i.iconfont.icon-QQFRIENDS(@tap="otherLogin('qq')")
        .tip 登录代表您已经同意
          a(@tap="openNViewPreload('legal_user_agreement')") 《用户协议》
          | 和
          a(@tap="openNViewPreload('legal_privacy_policy')") 《隐私政策》
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
  import {plusKey} from '../../assets/js/locationStorage'

  export default {
    name: 'login',
    data() {
      return {
        loginType: true,
        phone: '',
        code: '',
        pwd: '',
        codeFlag: true,
        codeText: '获取验证码',
        totalTime: '60',
        clientid: '',
        os_type: '',
      }
    },
    mounted() {
      mui.os.ios ? this.os_type = 1 : this.os_type = 2;
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
              mobile_no: this.phone,
              type: 2,
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
      }
      ,//打开页面
      openWindow: myMethods.openWindow,
      openNViewPreload: myMethods.openNViewPreload,
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
          mui.toast('请输入密码');
          return
        }
        if (this.loginType === false && (this.code === "" || this.code.length !== 4)) {
          mui.toast('请输入4位验证码');
          return
        }
        let vueThis = this;
        mui.plusReady(() => {
          vueThis.getClientid();
          let data = {
            flag: vueThis.loginType ? 1 : 2,
            mobile: vueThis.phone,
            pwd: vueThis.loginType ? vueThis.pwd : vueThis.code,
            getui_id: vueThis.clientid,
            os_type: vueThis.os_type,
          };
          http({
            url: api.user_login,
            data: data,
            method: 'post',
            success: (data) => {
              mui.plusReady(() => {
                plus.storage.setItem(plusKey.token, data);
                plus.storage.setItem(plusKey.state, "true");
                let view = plus.webview.getWebviewById('me');
                let viewMes = plus.webview.getWebviewById('message');
                myMethods.muiFireLock(view, () => {
                  mui.fire(view, 'loginSuccess', {
                    msg: '登录成功'
                  });
                });
                myMethods.muiFireLock(viewMes, () => {
                  mui.fire(viewMes, 'loginSuccess', {
                    msg: '登录成功'
                  });
                });
                plus.webview.currentWebview().close();
              });
            },
            noFind: () => {
              mui.toast('账号不存在~')
            },
            error: (data) => {
              mui.toast(data.msg);
            }
          })
        });

      },
      otherLogin(type) {
        let vueThis = this;
        mui.plusReady(function () {
          vueThis.getClientid();
          plus.oauth.getServices((services) => {
            let sever;
            for (let i = 0; i < services.length; i++) {
              if (services[i].id === type) {
                sever = services[i];
              }
              services[i].logout(function (e) {
                console.log('清除授权列表成功~')
              }, function (e) {
                console.log('清除授权列表失败~')
              });
            }
            sever.login(function (e) {
              sever.getUserInfo(function (e) {
                vueThis.oauthDo(type, sever)
              }, function (e) {
                mui.toast('获取用户信息失败');
              });
            }, function (e) {
              vueThis.oauthDo(type, sever);
              mui.toast('登录认证失败');
            });
          })
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
        if (!this.clientid) {
          this.getClientid();
        }
      },
      //第三方登录操作
      oauthDo(type, sever) {
        let opts = {
          flag: type === 'weixin' ? 1 : 2,
          icon: sever.userInfo.headimgurl,
          nick_name: sever.userInfo.nickname,
          getui_id: this.clientid,
          os_type: this.os_type,
        };
        if (type === 'qq') {
          http({
            url: 'https://graph.qq.com/oauth2.0/me',
            data: {
              access_token: sever.authResult.access_token,
            },
            error(data) {
              let str = data.replace('callback(', '');
              str = str.replace(');', '');
              str = str.trim();
              opts['openid'] = JSON.parse(str).openid;
              http({
                url: api.user_auth,
                data: opts,
                method: 'post',
                success(data) {
                  plus.storage.setItem(plusKey.token, data);
                  plus.storage.setItem(plusKey.state, "true");
                  let view = plus.webview.getWebviewById('me');
                  let viewMes = plus.webview.getWebviewById('message');
                  myMethods.muiFireLock(view, () => {
                    mui.fire(view, 'loginSuccess', {
                      msg: '登录成功'
                    });
                  });
                  myMethods.muiFireLock(viewMes, () => {
                    mui.fire(viewMes, 'loginSuccess', {
                      msg: '登录成功'
                    });
                  });
                  plus.webview.currentWebview().close();
                },
                noFind(data) {
                  mui.preload({
                    url: './login_other.html',
                    id: 'login_other'
                  });
                  let detailPage = plus.webview.getWebviewById('login_other');
                  myMethods.muiFireLock(detailPage, () => {
                    mui.fire(detailPage, 'getData', opts);
                  });
                  mui.openWindow('login_other');
                }
              });
            }
          })
        } else {
          opts['openid'] = sever.userInfo.openid;
          http({
            url: api.user_auth,
            data: opts,
            method: 'post',
            success(data) {
              plus.storage.setItem(plusKey.token, data);
              plus.storage.setItem(plusKey.state, "true");
              let view = plus.webview.getWebviewById('me');
              let viewMes = plus.webview.getWebviewById('message');
              myMethods.muiFireLock(view, () => {
                mui.fire(view, 'loginSuccess', {
                  msg: '登录成功'
                });
              });
              myMethods.muiFireLock(viewMes, () => {
                mui.fire(viewMes, 'loginSuccess', {
                  msg: '登录成功'
                });
              });
              plus.webview.currentWebview().close();
            },
            noFind(data) {
              mui.preload({
                url: './login_other.html',
                id: 'login_other'
              });
              let detailPage = plus.webview.getWebviewById('login_other');
              myMethods.muiFireLock(detailPage, () => {
                mui.fire(detailPage, 'getData', opts);
              });
              mui.openWindow('login_other');
            }
          });
        }
      }
    }
  }
</script>
