<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 系统设置
    .mui-content
      ul.media-view
        li.media
          .media-content.flex
            span 新消息通知
            switchBox.fr(:status='notify_im_message', :keyName="'notify_im_message'", @changeStatus="upStatus")
        li.media
          .media-content.flex
            span 微信接收消息提醒
            switchBox.fr(:status='notify_im_message', :keyName="'notify_im_message'", @changeStatus="upStatus")
        li.media
          .media-content.flex
            span 消息免打扰
            switchBox.fr(:status='notify_im_message', :keyName="'notify_im_message'", @changeStatus="upStatus")
        li.tip 23:00 - 8:00 将不接收任何通知
        li.media
          .media-content.iconfont.icon-right
            .media-lable 微信公众号
            .media-value {{is_wxbind ? '已绑定' : '去绑定'}}
        li.media
          .media-content.iconfont.icon-right
            .media-lable 检测新版本
            .media-value v1.0.0.0
        li.media
          .media-content.iconfont.icon-right
            .media-lable 清理本地缓存
            .media-value 12.9MB
      .fixed-bottom-btn 退出登录
</template>
<style lang="stylus" scoped>
  @import "systemSetting.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'

  export default {
    name: 'coupon',
    data() {
      return {
        notify_im_message:0,
        notify_wx_message:0,
        notify_busy:0,
        is_wxbind:0,
      }
    },
    components:{
      switchBox:switchBox
    },
    mounted() {

      mui.init({

      });

    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_system_config,
          success: (data) => {
            for (let index in data){
             this[index] = data[index];
            }
          }
        });
      },
      upStatus(data){
        this[data.key] = data.value;
      }
    }
  }
</script>
