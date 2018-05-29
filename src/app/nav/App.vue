// src/app/nav/App.vue

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
  /* global mui plus */
  export default {
    name: 'tabs',
    data () {
      return {
        // 当前激活的 tab 序号
        activeIndex: 0,
        tabs: [
          { index: 0, id: 'home', name: '首页', icon: 'icon-ai-home', url: './home.html' },
          { index: 1, id: 'tab2', name: '消息', icon: 'icon-news', url: 'http://www.dcloud.io/hellomui/examples/tableviews.html' },
          { index: 2, id: 'search', name: '查询', icon: 'icon-INQUIRE', url: './search.html' },
          { index: 3, id: 'tab4', name: '服务', icon: 'icon-SERVICE', url: 'http://www.dcloud.io/hellomui/examples/icons.html' },
          { index: 4, id: 'tab4', name: '我的', icon: 'icon-ME-copy', url: 'http://www.dcloud.io/hellomui/examples/icons.html' },
        ]
      }
    },
    methods: {
      openTabPage: function (index) {
        let styles = { top: this.changeRem(0), bottome: this.changeRem(0.45), zindex: 1 };
        // 获取父 webview，即 index.html 所属 webview
        let main = plus.webview.currentWebview().parent();
        // 如果当前 tab 已被激活，则返回
        if (index === this.activeIndex) return
        // 如 plus 中不存在当前要打开的子 webview id，则新建并追加到父 webview
        if (!plus.webview.getWebviewById(this.tabs[index].id)) {
          let subWebview = plus.webview.create(this.tabs[index].url, this.tabs[index].id, styles);
          main.append(subWebview)
        }
        // 显示要打开的子 webview
        plus.webview.show(this.tabs[index].id);
        // 设置当前 tab index
        this.activeIndex = index
      },
      changeRem:function (rem) {
        let windowWidth = document.documentElement.clientWidth;
        let px=windowWidth*0.26667*rem;
        return `${px}px`;
      }
    },
    mounted () {
      mui.init()
    }
  }
</script>
