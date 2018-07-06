<template lang="pug">
  #app
    iframe(:src="chatUrl")

</template>
<style lang="stylus" scoped>
  @import "chat.styl"
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
    name: 'login',
    data() {
      return {
        chatUrl:""
      }
    },
    mounted() {
      window.addEventListener('getData',(e)=>{
        this.chatUrl = e.detail.chatUrl
      })
    },
    created() {

    },
    methods: {

    }
  }
</script>
