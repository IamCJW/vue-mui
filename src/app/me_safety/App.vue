<template lang="pug">
  #app
    .mui-content
      ul.media-view.funList
        li.media(@tap="openNViewPreload('changePwd')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 修改密码
        li.media(@tap="openNViewPreload('changePhone')")
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 修改手机号
            .media-value {{mobile}}
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black 微信绑定
            template(v-show="dataLock")
              .media-value(v-if="wx") 已绑定
              .media-value(v-if="!wx" @tap="otherLogin('weixin')") 去绑定
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black QQ绑定
            template(v-show="dataLock" @tap="otherLogin('qq')")
              .media-value(v-if="qq") 已绑定
              .media-value(v-if="!qq" @tap="otherLogin('qq')") 去绑定
</template>
<style lang="stylus" scoped>
  @import "safety.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import {lsKey} from "../../assets/js/locationStorage";

  export default {
    name: 'safety',
    data() {
      return {
        dataLock: false,
        wx: false,
        qq: false,
        mobile:'',
      }
    },
    mounted() {
      this.mobile = localStorage.getItem(lsKey.userMobile);
      window.addEventListener('getData', () => {
        this.getData();
      })
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_security_bind,
          success: (data) => {
            data.forEach((item) => {
              if (item.type === 'wx') {
                this.wx = true
              }
              if (item.type === 'qq') {
                this.qq = true;
              }
            })
          },
          noFind: () => {
            this.dataLock = true;
          }
        })
      },//打开页面
      openNViewPreload: myMethods.openNViewPreload,
      otherLogin(type) {
        let vueThis = this;
        mui.plusReady(function () {
          plus.oauth.getServices((services) => {
            let sever;
            for (let i = 0; i < services.length; i++) {
              if (services[i].id === type) {
                sever = services[i];
                break;
              }
            }
            if (!sever.authResult) {
              sever.login(function (e) {
                sever.getUserInfo(function (e) {
                  vueThis.oauthDo(type, sever)
                }, function (e) {
                  mui.toast('获取用户信息失败');
                });
              }, function (e) {
                mui.toast('登录认证失败');
              });
            } else {
              vueThis.oauthDo(type, sever)
            }
          })
        })
      },
      //第三方登录操作
      oauthDo(type, sever) {
        let opts = {
          flag: type === 'weixin' ? 1 : 2,
          icon: sever.userInfo.headimgurl,
          nick_name: sever.userInfo.nickname,
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
                url: api.member_security_bind,
                data: opts,
                method: 'post',
                success:()=>{
                  mui.toast('绑定QQ成功');
                  this.getData();
                },
                error(){
                  plus.oauth.getServices(function (services) {
                    for (let i in services) {
                      let s = services[i];
                      if (s.authResult) {
                        s.logout(function (e) {
                          console.log('清除授权列表成功~')
                        }, function (e) {
                          console.log('清除授权列表失败~')
                        });
                      }
                    }
                  }, function (e) {
                    console.log('获取授权列表失败~')
                  });
                }
              });
            }
          })
        } else {
          opts['openid'] = sever.userInfo.openid;
          http({
            url: api.member_security_bind,
            data: opts,
            method: 'post',
            success(data) {
              mui.toast('绑定微信成功');
              this.getData();
            },
            error(){
              plus.oauth.getServices(function (services) {
                for (let i in services) {
                  let s = services[i];
                  if (s.authResult) {
                    s.logout(function (e) {
                      console.log('清除授权列表成功~')
                    }, function (e) {
                      console.log('清除授权列表失败~')
                    });
                  }
                }
              }, function (e) {
                console.log('获取授权列表失败~')
              });
            }
          });
        }
      }
    }
  }
</script>
