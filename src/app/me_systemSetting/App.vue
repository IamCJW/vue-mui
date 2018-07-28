<template lang="pug">
  #app
    .mui-content
      ul.media-view
        li.media
          .media-content.flex
            span 新消息通知
            .warn-tip(v-if="notify_im_message") 此功能需开启消息权限，可在设置中开启~
            switchBox.fr(:status='notify_im_message', :keyName="'notify_im_message'", @changeStatus="upStatus")
        li.media(v-if="notify_im_message", @tap="chooseNotify_type")
          .media-content.iconfont.icon-right
            .media-lable 消息提醒频率
            .media-value {{notify_type === 0 ? '实时提醒' : notify_type+'分钟'}}
        li.media
          .media-content.flex
            span 消息免打扰
            switchBox.fr(:status='notify_busy', :keyName="'notify_busy'", @changeStatus="upStatus")
        li.tip 23:00 - 8:00 将不接收任何通知
        li.media
          .media-content.iconfont.icon-right(@tap="wx_bind")
            .media-lable 微信公众号
            .media-value {{is_wxbind ? '已绑定' : '去绑定'}}
        li.media
          .media-content.iconfont.icon-right
            .media-lable 检测新版本
            .media-value(:class="[isNew ? 'iconfont icon-warning':'']", @tap="verCheck") {{version ? 'v'+version : '正在检测'}}
        li.media(@tap="localStorageClear")
          .media-content.iconfont.icon-right
            .media-lable 清理本地缓存
            .media-value {{localStorageLength || '正在计算'}}
      button.fixed-bottom-btn(@tap="loginOut") 退出登录
    .mask(v-if='wxCode')
      .popout
        .codeBox
          img(v-show="codeUrl",:src="codeUrl")
        .description 截图扫描图中二维码，绑定建设帮公众号，获取更多最新消息，该码有效期两小时
        button.mid-btn(@tap="codeShow") 关闭
</template>
<style lang="stylus" scoped>
  @import "systemSetting.styl"

</style>
<script>
  /* global mui */
  /* global mui plus */
  import {plusKey} from '../../assets/js/locationStorage.js'
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'

  export default {
    name: 'coupon',
    data() {
      return {
        notify_im_message: 0,
        notify_type: 0,
        notify_busy: 0,
        is_wxbind: 0,
        localStorageLength: '',
        version: '',
        isNew: false,
        verData: {},
        wxCode: false,
        codeUrl: '',
        pushP: false,
      }
    },
    components: {
      switchBox: switchBox
    },
    mounted() {
      this.getData();
      let vueThis = this;
      mui.plusReady(() => {
        vueThis.version = plus.runtime.version;
        let pp = plus.navigator.checkPermission('NOTIFITION');
        if (pp !== 'authorized') vueThis.pushP = true;
      });
      window.addEventListener('getData', () => {
        this.getData();
      });
      mui.init({});
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.localStorageLengthGet();
        http({
          url: api.member_system_config,
          success: (data) => {
            for (let index in data) {
              this[index] = data[index];
            }
          }
        });
      },
      upStatus(data) {
        let switchData = data;
        http({
          url: api.member_system_config,
          dataType: true,
          method: 'post',
          data: {
            notify_im_message: (switchData.key === 'notify_im_message' ? switchData.value : this.notify_im_message) ? 1 : 0,
            notify_busy: (switchData.key === 'notify_busy' ? switchData.value : this.notify_busy) ? 1 : 0,
            notify_type: this.notify_type,
            is_wxbind: this.is_wxbind ? 1 : 0,
          },
          success: () => {
            this[switchData.key] = switchData.value;
          },
          error: (data) => {
            mui.toast(data.msg);
          }
        });
      },
      openWindow: myMethods.openWindow,
      //清除缓存
      localStorageClear() {
        window.localStorage.clear();
        this.localStorageLengthGet();
        mui.toast('清理完毕');
        mui.plusReady(() => {
          let homeView = plus.webview.getWebviewById('home');
          myMethods.muiFireLock(homeView, () => {
            mui.fire(homeView, 'localStorageClear', {msg: '缓存被清理'})
          });
          let selectLocation = plus.webview.getWebviewById('selectLocation');
          myMethods.muiFireLock(selectLocation, () => {
            mui.fire(selectLocation, 'localStorageClear', {msg: '缓存被清理'})
          });
          let selectQualify = plus.webview.getWebviewById('selectQualify');
          myMethods.muiFireLock(selectQualify, () => {
            mui.fire(selectQualify, 'localStorageClear', {msg: '缓存被清理'})
          });
          let selectQualifys = plus.webview.getWebviewById('selectQualifys');
          myMethods.muiFireLock(selectQualifys, () => {
            mui.fire(selectQualifys, 'localStorageClear', {msg: '缓存被清理'})
          });
        })
      },
      //获取本地缓存
      localStorageLengthGet() {
        let size = 0;
        for (let item in window.localStorage) {
          if (window.localStorage.hasOwnProperty(item)) {
            size += window.localStorage.getItem(item).replace(/[\u0391-\uFFE5]/g, "aa").length;
          }
        }
        this.localStorageLength = `${(size / 1024 / 1024).toFixed(2)}MB`;
      },
      //版本检查
      verCheck() {
        let vueThis = this;
        http({
          url: api.system_check_version,
          data: {ver: vueThis.version},
          success: (data) => {
            vueThis.verData = data;
            vueThis.isNew = true;
            if (this.isNew) {
              mui.confirm(`您有新的版本${vueThis.verData.ver}可以更新,是否前往下载更新？`, '提醒', ['取消', '确定'], function (e) {
                if (e.index === 1) {
                  mui.openWindow(vueThis.verData.url);
                }
              }, 'div')
            } else {
              mui.toast('暂未检测到新版本~')
            }
          },
        });
      },
      //退出登录
      loginOut() {
        http({
          url: api.member_logout,
          success() {
            plus.storage.removeItem(plusKey.token);
            plus.storage.removeItem(plusKey.state);
            plus.oauth.getServices(function (services) {
              for (let i in services) {
                let s = services[i];
                s.logout(function (e) {
                  console.log('清除授权列表成功~')
                }, function (e) {
                  console.log('清除授权列表失败~')
                });
              }
            }, function (e) {
              console.log('获取授权列表失败~')
            });
            let view = plus.webview.getWebviewById('me');
            let homeView = plus.webview.getWebviewById('home');
            let msgView = plus.webview.getWebviewById('message');
            myMethods.muiFireLock(msgView, () => {
              mui.fire(msgView, 'loginOut', {
                msg: '退出登录成功~'
              });
            });
            myMethods.muiFireLock(view, () => {
              mui.fire(view, 'loginOut', {
                msg: '退出登录成功~'
              });
            });
            myMethods.muiFireLock(homeView, () => {
              mui.fire(homeView, 'loginOut', {
                msg: '退出登录成功~'
              });
            });
            plus.webview.currentWebview().close();
          },
          error(data) {
            mui.toast(data.msg);
          }
        })
      },
      //频率选择
      chooseNotify_type() {
        let vueThis = this;
        //普通示例
        let userPicker = new mui.PopPicker();
        userPicker.setData([{
          value: '0',
          text: '实时提醒'
        }, {
          value: '30',
          text: '半小时'
        }, {
          value: '60',
          text: '一小时'
        }, {
          value: '120',
          text: '两小时'
        }]);
        userPicker.pickers[0].setSelectedValue(vueThis.notify_type);
        userPicker.show(function (items) {
          http({
            url: api.member_system_config,
            dataType: true,
            method: 'post',
            data: {
              notify_im_message: vueThis.notify_im_message ? 1 : 0,
              notify_busy: vueThis.notify_busy ? 1 : 0,
              notify_type: Number(items[0].value),
              is_wxbind: vueThis.is_wxbind ? 1 : 0,
            },
            success: () => {
              vueThis.notify_type = Number(items[0].value);
              mui.toast('修改频率成功~')
            },
            error: (data) => {
              mui.toast(data.msg);
            }
          });
        });
      },
      //微信绑定///////
      wx_bind() {
        if (this.is_wxbind) {
          return
        } else {
          http({
            url: api.common_wx_qrcode,
            success: (data) => {
              this.codeUrl = data.url;
              this.codeShow();
            },
            error: (data) => {
              mui.toast(data.msg)
            }
          })
        }
      },
      //绑定窗口////
      codeShow() {
        let vueThis = this;
        if (this.wxCode) {
          let wc = plus.webview.currentWebview();
          let bitmap = new plus.nativeObj.Bitmap("test");
          // 将webview内容绘制到Bitmap对象中
          wc.draw(bitmap, function () {
            console.log('绘制图片成功');
            bitmap.save("_doc/a.jpg"
              , {}
              , function (i) {
                console.log('保存图片成功：' + JSON.stringify(i));
                plus.gallery.save("_doc/a.jpg", function () {
                  mui.toast("保存图片到相册成功");
                  vueThis.wxCode = !vueThis.wxCode;
                });
              }
              , function (e) {
                console.log('保存图片失败：' + JSON.stringify(e));
              });
          }, function (e) {
            console.log('绘制图片失败：' + JSON.stringify(e));
          });
        } else {
          this.wxCode = !this.wxCode;
        }

      }
    }
  }
</script>
