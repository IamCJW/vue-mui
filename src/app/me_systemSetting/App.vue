<template lang="pug">
  #app
    .mui-content
      ul.media-view
        li.media
          .media-content.flex
            span 新消息通知
            switchBox.fr(:status='notify_im_message', :keyName="'notify_im_message'", @changeStatus="upStatus")
        li.media
          .media-content.flex
            span 微信接收消息提醒
            switchBox.fr(:status='notify_wx_message', :keyName="'notify_wx_message'", @changeStatus="upStatus")
        li.media
          .media-content.flex
            span 消息免打扰
            switchBox.fr(:status='notify_busy', :keyName="'notify_busy'", @changeStatus="upStatus")
        li.tip 23:00 - 8:00 将不接收任何通知
        li.media
          .media-content.iconfont.icon-right
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
        notify_wx_message: 0,
        notify_busy: 0,
        is_wxbind: 0,
        localStorageLength: '',
        version: '',
        isNew: true,
        verData: {},
      }
    },
    components: {
      switchBox: switchBox
    },
    mounted() {
      let vueThis = this;
      mui.plusReady(() => {
        vueThis.version = plus.runtime.version;
        http({
          url: api.system_check_version,
          data: {ver: vueThis.version},
          success: (data) => {
            vueThis.verData = data;
            vueThis.isNew = true;
          }
        })
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
          url:api.member_system_config,
          dataType:true,
          method:'post',
          data:{
            notify_im_message: this.notify_im_message ? 1 : 0,
            notify_wx_message: this.notify_wx_message ? 1 : 0,
            notify_busy: this.notify_busy ? 1 : 0,
            is_wxbind: this.is_wxbind ? 1 : 0,
          },
          success:()=>{
            this[switchData.key] = switchData.value;
          },
          error:(data)=>{
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
          mui.fire(homeView, 'localStorageClear', {msg: '缓存被清理'})
          let selectLocation = plus.webview.getWebviewById('selectLocation');
          mui.fire(selectLocation, 'localStorageClear', {msg: '缓存被清理'})
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
            let view = plus.webview.getWebviewById('me');
            let homeView = plus.webview.getWebviewById('home');
            mui.fire(view, 'loginOut', {
              msg: '退出登录成功~'
            });
            mui.fire(homeView, 'loginOut', {
              msg: '退出登录成功~'
            });
            plus.webview.currentWebview().close();
          },
          error(data) {
            mui.toast(data.msg);
          }
        })
      }
    }
  }
</script>
