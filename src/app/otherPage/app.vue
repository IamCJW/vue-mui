<template lang="pug">
  #app

</template>
<style lang="stylus" scoped>
  @import "otherPage.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */

  export default {
    name: 'otherPage',
    data() {
      return {}
    },
    mounted() {
      mui.plusReady(() => {
        let otherUrl = plus.webview.currentWebview().otherUrl;
        if (mui.os.ios) {
          mui.init({
            subpages: [{
              url: otherUrl,
              id: 'otherContent',
              styles: {
                top: '0',
                scalable: true,
                kernel: {
                  ios: "WKWebview"
                },
                dock: 'left',
                scrollIndicator: 'all',
                position: 'static',
              }
            }]
          });
        } else {
          mui.init({
            subpages: [{
              url: otherUrl,
              id: 'otherContent',
              styles: {
                scalable: true,
                kernel: {
                  ios: "WKWebview"
                },
                dock: 'left',
                scrollIndicator: 'all',
                position: 'static',
              }
            }]
          });
        }
      })
    },
    created() {

    },
    methods: {}
  }
</script>
