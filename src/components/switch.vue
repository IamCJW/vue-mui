<template lang="pug">
  .switch(:class="{active : status}", @tap="changeStatus")
    .switch-handle
</template>
<style lang="stylus" scoped>
  @import "../stylus/_mixin.styl"
  .switch
    height: 0.3rem;
    width: 0.6rem;
    border: $border-default;
    border-radius: .3rem;
    position: relative;
    transition background-color .3s
    .switch-handle
      position: absolute;
      width: .26rem;
      height: .26rem;
      background: #ffffff;
      border-radius: 100%;
      top: .01rem;
      left: .02rem;
      box-shadow 0 0.02rem 0.05rem rgba(0, 0, 0, 0.26)
      transition left .3s
    &.active
      background $fourth-color
      .switch-handle
        left .3rem
</style>
<script>
  export default {
    name: "switchBox",
    props: {
      status: {
        required: true
      },
      keyName:{
        type:String,
        required:true
      }
    },
    data(){
      return{

      }
    },
    methods: {
      changeStatus() {
        let data = {
          key:this.keyName,
          value:!this.status
        };
        this.$emit('changeStatus',data);
      }
    }
  }
</script>
