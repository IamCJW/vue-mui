<template lang="pug">
  nav.mui-bar.mui-bar-tab
    a.mui-tab-item(v-for='tab in tabs', :class='{ "mui-active": activeIndex === tab.index }', v-on:tap='openTabPage(tab.index)')
      span.mui-icon.iconfont(:class='tab.icon')
      span.mui-tab-label {{ tab.name }}
</template>
<style lang="stylus" scoped>
  @import "nav.styl"
</style>

<script>
  /* global mui */
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
          {
            index: 3,
            id: 'tab4',
            name: '服务',
            icon: 'icon-SERVICE',
            url: 'http://www.dcloud.io/hellomui/examples/icons.html'
          },
          {index: 4, id: 'me', name: '我的', icon: 'icon-ME-copy', url: './me.html'},
        ],
        thisWebView: {},
        styles: {},
      }
    },
    mounted() {
      let navHeight = this.changeRem(0.49);
      mui.init({
        wipeBack: true,
      });

      mui.plusReady(() => {
        let styles = {top: this.changeRem(0), bottom: this.changeRem(0.49), zindex: 1};
        let main = plus.webview.currentWebview();
        this.tabs.forEach((item, index) => {
          let subWebview = plus.webview.create(item.url, item.id, styles);
          main.append(subWebview);
          if(index === 0){
            subWebview.show();
          }else {
            subWebview.hide();
          }
        })
      })
    },
    methods: {
      openTabPage: function (index) {
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
          // 显示要打开的子 webview
          plus.webview.show(this.tabs[index].id);
          plus.webview.hide(this.tabs[this.activeIndex].id);
          // 设置当前 tab index
          this.activeIndex = index
        });
      },
      changeRem: function (rem) {
        let windowWidth = document.documentElement.clientWidth;
        let px = windowWidth * 0.26667 * rem;
        return `${px}px`;
      }
    }
  }
</script>
