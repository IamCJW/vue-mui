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
              .media-value.text-color-assist(v-if="wx" @tap="unBind('weixin')") 解除绑定
              .media-value(v-if="!wx" @tap="otherLogin('weixin')") 去绑定
        li.media
          .media-content.iconfont.icon-right
            .media-lable.text-color-black QQ绑定
            template(v-show="dataLock")
              .media-value.text-color-assist(v-if="qq" @tap="unBind('qq')") 解除绑定
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
        wxData: {},
        qq: false,
        qqData: {},
        mobile: '',
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
            console.log(JSON.stringify(data));
            this.wx = false;
            this.qq = false;
            data.forEach((item) => {
              if (item.type === 'wx') {
                this.wx = true;
                this.wxData = item;
              }
              if (item.type === 'qq') {
                this.qq = true;
                this.qqData = item;
              }
            })
          },
          noFind: () => {
            this.dataLock = true;
            this.wx = false;
            this.qq = false;
          }
        })
      },//打开页面
      openNViewPreload: myMethods.openNViewPreload,
      otherLogin(type) {
        let vueThis = this;
        mui.plusReady(function () {
          plus.oauth.getServices(
            (services) => {
              let sever;
              for (let i = 0; i < services.length; i++) {
                if (services[i].id === type) {
                  sever = services[i];
                  break;
                }
              }
              sever.login(
                (e) => {
                  sever.getUserInfo(
                    (e) => {
                      vueThis.oauthDo(type, sever)
                    },
                    (e) => {
                      mui.toast('获取用户信息失败');
                    }
                  );
                },
                (e) => {
                  sever.logout(function (e) {
                    console.log('清除授权列表成功~')
                  }, function (e) {
                    console.log('清除授权列表失败~')
                  });
                  mui.toast('登录认证失败');
                }
              );
            },
            () => {
              mui.toast('登录认证失败');
            })
        })
      },
      //第三方登录操作
      oauthDo(type, sever) {
        let vueThis = this;
        let opts = {
          flag: type === 'weixin' ? 1 : 2,
          icon: sever.userInfo.headimgurl,
          nick_name: sever.userInfo.nickname,
        };
        if (type === 'qq') {
          opts['openid'] = sever.authResult.openid;
          http({
            url: api.member_security_bind,
            data: opts,
            method: 'post',
            success: () => {
              mui.toast('绑定QQ成功');
              vueThis.getData();
            },
            error() {
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
        } else {
          opts['openid'] = sever.userInfo.openid;
          http({
            url: api.member_security_bind,
            data: opts,
            method: 'post',
            success(data) {
              mui.toast('绑定微信成功');
              vueThis.getData();
            },
            error() {
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
      },
      // 解除绑定//////////
      unBind(type) {
        let message = type === 'weixin' ? '微信' : 'QQ';
        mui.confirm(`解除${message}绑定，将无法快捷登录，确定解除绑定？`, ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            let bindData = type === 'weixin' ? this.wxData : this.qqData;
            http({
              url: api.member_security_unbind,
              method: 'post',
              data: {
                flag: type === 'weixin' ? 1 : 2,
                openid: bindData.open_id
              },
              success: () => {
                mui.toast('解绑成功');
                this.otherLoginOut(type);
                this.getData();
              }
            });
          }
        }, 'div')
      },
      otherLoginOut(type) {
        plus.oauth.getServices(function (services) {
          let sever;
          for (let i = 0; i < services.length; i++) {
            if (services[i].id === type) {
              sever = services[i];
            }
          }
          sever.logout(function (e) {
            console.log('清除授权列表成功~')
          }, function (e) {
            console.log('清除授权列表失败~')
          });
        });
      },
    }
  }
</script>
