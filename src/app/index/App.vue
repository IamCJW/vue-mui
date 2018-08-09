<template lang="pug">
  nav.mui-bar.mui-bar-tab
    a.mui-tab-item(v-for='tab in tabs', :class='{ "mui-active": activeIndex === tab.index,"news-item": tab.index === 1 && news}', v-on:tap='openTabPage(tab.index)')
      span.mui-icon.iconfont(:class='tab.icon')
      span.mui-tab-label {{ tab.name }}
</template>
<style lang="stylus" scoped>
  @import "nav.styl"
  .news-item:after
    content ''
    width .08rem
    height .08rem
    background-color $assist-color
    border-radius 100%
    position absolute
    top 16%
    left 56%
    z-index $z-index-popout


</style>

<script>
  /* global mui */
  import myMethods from '../../assets/js/methods'
  import {lsKey, plusKey} from "../../assets/js/locationStorage";

  export default {
    name: 'index',
    data() {
      return {
        // 当前激活的 tab 序号
        activeIndex: 0,
        tabs: [
          {index: 0, id: 'home', name: '首页', icon: 'icon-ai-home', url: './home.html'},
          {index: 1, id: 'message', name: '消息', icon: 'icon-news', url: './message.html'},
          {index: 2, id: 'search', name: '查询', icon: 'icon-INQUIRE', url: './search.html'},
          // {
          //   index: 3,
          //   id: 'tab4',
          //   name: '服务',
          //   icon: 'icon-SERVICE',
          //   url: 'http://www.dcloud.io/hellomui/examples/icons.html'
          // },
          {index: 3, id: 'me', name: '我的', icon: 'icon-ME-copy', url: './me.html'},
        ],
        thisWebView: {},
        styles: {},
        news: false,
      }
    },
    mounted() {
      let vueThis = this;
      if (mui.os.ios) {
        let ws = plus.webview.currentWebview();
        ws.setStyle({'popGesture': 'none'});
      }
      window.addEventListener('changeTabNav', (e) => {
        this.activeIndex = e.detail.index;
        if (e.detail.index === 1) {
          this.news = false;
        }
      });
      let preload = () => {
        let styles = {top: this.changeRem(0), bottom: this.changeRem(0.49), zindex: 1};
        let main = plus.webview.currentWebview();
        this.tabs.forEach((item, index) => {
          let subWebview = plus.webview.create(item.url, item.id, styles);
          main.append(subWebview);
          subWebview.show();
          if (index === 1) {
            let view = plus.webview.getWebviewById('message');
            view.addEventListener('show', () => {
              localStorage.setItem(lsKey.isMessage, '1');
            });
            view.addEventListener('hide', () => {
              mui.fire(view, 'openInit', {});
              localStorage.removeItem(lsKey.isMessage);
            });
          }
          if (index === 3) {
            let view = plus.webview.getWebviewById('home');
            view.addEventListener('loaded', () => {
              mui.fire(view, 'openInit', {})
            });
            plus.webview.getWebviewById('home').show();
          }
        });
        this.pushMsg();
      };
      mui.plusReady(() => {
        if (plus.storage.getItem(plusKey.firstOpen)) {
          setTimeout(function () {
            preload();
          }, 200);
        } else {
          plus.navigator.setFullscreen(true);
          mui.openWindow({
            id: 'guide',
            url: './guide.html',
            styles: {},
            show: {
              aniShow: 'none'
            },
            waiting: {
              autoShow: false
            }
          });
          setTimeout(function () {
            preload();
          }, 200);
        }
      })
    },
    methods: {
      openTabPage: function (index) {
        if (index === 1) {
          this.news = false;
        }
        // 如果当前 tab 已被激活，则返回
        if (index === this.activeIndex) return;
        let styles = {top: this.changeRem(0), bottom: this.changeRem(0.49), zindex: 1};
        mui.plusReady(() => {
          let main = plus.webview.currentWebview();
          // 如 plus 中不存在当前要打开的子 webview id，则新建并追加到父 webview
          if (!plus.webview.getWebviewById(this.tabs[index].id)) {
            let subWebview = plus.webview.create(this.tabs[index].url, this.tabs[index].id, styles);
            main.append(subWebview)
          }
          let view = plus.webview.getWebviewById(this.tabs[index].id);
          myMethods.muiFireLock(view, () => {
            mui.fire(view, 'getData', {});
          });
          // 显示要打开的子 webview
          plus.webview.show(this.tabs[index].id, 'fade-in', 300);
          // 设置当前 tab index
          this.activeIndex = index;
        });
      },
      changeRem: myMethods.changeRem,
      // 推送消息处理
      pushMsg() {
        let vueThis = this;
        plus.push.addEventListener("receive", (msg) => {
          if (msg.payload.msgType) return;
          vueThis.news = true;
          if (!msg.aps) {
            let BadgeNumber;
            if (localStorage.getItem(lsKey.BadgeNumber)) {
              BadgeNumber = localStorage.getItem(lsKey.BadgeNumber) + 1
            } else {
              BadgeNumber = 1;
            }
            plus.runtime.setBadgeNumber(BadgeNumber);
            if (mui.os.ios) {
              plus.push.createMessage(msg.payload.content, {"msgType": 1});
            }
            if (localStorage.getItem(lsKey.isMessage)) {
              let view = plus.webview.getWebviewById('message');
              myMethods.muiFireLock(view, () => {
                mui.fire(view, 'getData', {});
              });
            }
          }
        }, false);
        plus.push.addEventListener("click", (msg) => {
          vueThis.news = false;
          vueThis.messageShow();
          plus.push.clear();
        }, false);
      },
      messageShow() {
        let view = plus.webview.getWebviewById('message');
        if (view) {
          myMethods.muiFireLock(view, () => {
            mui.fire(view, 'getData', {});
          });
          view.show('message', 'fade-in', 300);
          this.activeIndex = 1;
        } else {
          this.messageShow();
        }
      },
    }
  }
</script>
