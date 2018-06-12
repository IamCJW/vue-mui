<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 订阅管理
    .mui-content
      template(v-if="subscriptionData.data.length === 0")
        .none
          i.iconfont.icon-subscription
          span 暂无订阅信息，请先添加订阅~
        button.mid-btn(@tap="openWindow('subscription_add')") 添加订阅
      template(v-show="subscriptionData.data.length !== 0")
        .content-wrapper
          .mui-wrapper#page1
            .mui-scroll
              .content
                ul.media-view
                  li.media.media-more(v-for="(item,index) in subscriptionData.data")
                    .media-content
                      .media-lable
                        span 订阅{{index+1}}
                      .media-del
                        i.iconfont.icon-Rubbish
                        switchBox(:status="switchData['status'+item.id]", :key-name="'status'+item.id", @changeStatus="upStatus")
                    .media-alert
                      ul.media-view
                        li.media(@tap="openWindow('subscription_selectLocation',item)")
                          .media-content.iconfont.icon-right {{item.province+item.city+item.district}}
                        li.media(@tap="openWindow('subscription_selectQualification',item)")
                          .media-content.iconfont.icon-right
                            .qualify-group
                              .qualify-title
                                span 订阅资质
                              .qualify-item(v-for="quanilify in item.quanlify_info")
                                span {{quanilify.category+quanilify.name}}-{{quanilify.level}}
        .fixed-bottom-btn(@tap="openWindow('subscription_add')") 添加订阅
</template>
<style lang="stylus" scoped>
  @import "subscription.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'

  export default {
    name: 'subscription',
    data() {
      return {
        subscriptionData:{
          pageNum:1,
          data:[]
        },switchData:{}
      }
    },
    components:{
      switchBox:switchBox,
    },
    mounted() {
      this.getData();
      window.addEventListener('chooseLocation',(e)=>{
        mui.toast(e.detail.msg);
      });
      window.addEventListener('chooseQualification',(e)=>{
        mui.toast(e.detail.msg);
      });
      let vueThis = this;
      mui.init({
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.subscriptionData.pageNum += 1;
              http({
                url: api.member_subscribe,
                data: {
                  province: vueThis.province,
                  cur_page: vueThis.subscriptionData.pageNum
                }, success: (data) => {
                  vueThis.subscriptionData.data = vueThis.subscriptionData.data.concat(data.result);
                  if (data.total_page === vueThis.subscriptionData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
                }
              });
            }
          }
        }]
      });
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_subscribe,
          success: (data) => {
            this.subscriptionData.data = data.result;
            data.result.forEach((item)=>{
              this.$set(this.switchData,`status${item.id}`,item.status);
            })
          }
        });
      },
      //更新开关的值
      upStatus(data){
        this.$set(this.switchData,data.key,data.value);
      },
      openWindow:myMethods.openWindow,
      //订阅删除
      subscriptionDel(){

      },
    }
  }
</script>
