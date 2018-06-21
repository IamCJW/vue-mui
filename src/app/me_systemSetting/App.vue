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
            .media-value v1.0.0.0
        li.media(@tap="localStorageClear")
          .media-content.iconfont.icon-right
            .media-lable 清理本地缓存
            .media-value {{localStorageLength || '正在计算'}}
      .fixed-bottom-btn(openWindow="openWindow('index')") 退出登录
</template>
<style lang="stylus" scoped>
  @import "systemSetting.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import {lsKey, ssKey} from '../../assets/js/locationStorage.js'
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
        localStorageLength:''
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
        this.localStorageLengthGet();
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
      },
      openWindow:myMethods.openWindow,
      localStorageClear(){
        window.localStorage.clear();
        this.localStorageLengthGet();
        mui.toast('清理完毕');
      },
      localStorageLengthGet(){
        let size = 0;
        for(let item in window.localStorage) {
          if(window.localStorage.hasOwnProperty(item)) {
            size += window.localStorage.getItem(item).replace(/[\u0391-\uFFE5]/g,"aa").length;
          }
        }
        this.localStorageLength = `${(size/1024/1024).toFixed(2)}MB`;
      }
    }
  }
</script>
