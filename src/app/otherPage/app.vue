<template lang="pug">
  #app
    iframe(:src="otherUrl")

</template>
<style lang="stylus" scoped>
  @import "otherPage.styl"
  iframe
    display block
    width 100vw
    height 100vh
    padding 0
    margin 0
    border none
</style>
<script>
  /* global mui */
  /* global mui plus */

  export default {
    name: 'otherPage',
    data() {
      return {
        otherUrl:""
      }
    },
    mounted() {
      window.addEventListener('getData',(e)=>{
        this.otherUrl = e.detail.otherUrl
      })
    },
    created() {

    },
    methods: {

    }
  }
</script>
