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
      return {

      }
    },
    mounted() {
      mui.back = ()=>{
        mui.plusReady(()=>{
          let view = plus.webview.currentWebview();
          view.close();
        })
      };
      window.addEventListener('getData',(e)=>{
        mui.init({
          subpages:[{
            url:e.detail.otherUrl,
            id:'otherContent',
            styles:{
              top:'45px',
            }
          }]
        });
      })
    },
    created() {

    },
    methods: {

    }
  }
</script>
