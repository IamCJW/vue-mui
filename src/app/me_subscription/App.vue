<template lang="pug">
  #app
    .mui-content
      loading(ref="loading")
      .none(v-show="dataLock && subscriptionData.data.length === 0")
        i.iconfont.icon-subscription
        span 暂无订阅信息，请先添加订阅~
        button.mid-btn(@tap="openNViewPreload('subscription_add')") 添加订阅
      .content-wrapper(v-show="dataLock && subscriptionData.data.length !== 0")
        .mui-wrapper#page1
          .mui-scroll
            .content
              ul.media-view
                li.media.media-more(v-for="(item,index) in subscriptionData.data")
                  .media-content
                    .media-lable
                      span 订阅{{index+1}}
                    .media-del
                      i.iconfont.icon-Rubbish(@tap="subscriptionDel(item.id)")
                      switchBox(:status="switchData[item.id]", :key-name="item.id", @changeStatus="upStatus")
                  .media-alert
                    ul.media-view
                      li.media(@tap="openNViewPreload('subscription_selectLocation',item)")
                        .media-content.iconfont.icon-right {{item.province+item.city+item.district}}
                      li.media.border-none(@tap="openNViewPreload('subscription_selectQualification',item)")
                        .media-content.iconfont.icon-right
                          .qualify-group
                            .qualify-title
                              span 订阅资质
                            .qualify-item(v-for="quanilify in item.quanlify_info")
                              span {{quanilify.category+quanilify.name}}-{{quanilify.level}}
        .fixed-bottom-btn(@tap="openNViewPreload('subscription_add')") 添加订阅
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
  import loading from '../../components/loading'

  export default {
    name: 'subscription',
    data() {
      return {
        dataLock: false,
        subscriptionData: {
          pageNum: 1,
          data: []
        },
        switchData: {}
      }
    },
    components: {
      switchBox: switchBox,
      loading: loading,
    },
    mounted() {
      window.addEventListener('getData', () => {
        this.getData();
        myMethods.NVpreload(['subscription_add', 'subscription_selectLocation', 'subscription_selectQualification']);
      });
      window.addEventListener('chooseLocation', (e) => {
        mui.toast(e.detail.msg);
        this.getData();
      });
      window.addEventListener('chooseQualification', (e) => {
        this.getData();
        mui.toast(e.detail.msg);
      });
      window.addEventListener('addSuccess', (e) => {
        this.getData();
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
                  cur_page: vueThis.subscriptionData.pageNum
                }, success: (data) => {
                  if (data.total_page <= vueThis.subscriptionData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.subscriptionData.data = vueThis.subscriptionData.data.concat(data.result);
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
        this.$refs.loading.show();
        this.dataLock = false;
        http({
          url: api.member_subscribe,
          success: (data) => {
            this.subscriptionData = {
              pageNum: 1,
              data: []
            };
            this.subscriptionData.data = data.result;
            data.result.forEach((item) => {
              this.$set(this.switchData, `${item.id}`, item.status);
            });
            this.$refs.loading.hide();
            this.dataLock = true;
            mui('#page1').pullRefresh().scrollTo(0, 0, 100);
          }
        });
      },
      //更新开关的值
      upStatus(switchData) {
        http({
          url:api.member_subscribe_status,
          method:'post',
          data:{
            id:switchData.key,
            status:switchData.value ? 1 : 0
          },
          success:()=>{
            this.$set(this.switchData, switchData.key, switchData.value);
          },
          error:(data)=>{
            mui.toast(data.msg)
          }
        });
      },
      openWindow: myMethods.openWindow,
      openNViewPreload: myMethods.openNViewPreload,
      //订阅删除
      subscriptionDel(id) {
        mui.confirm('确定删除该订阅？', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.member_subscribe,
              method: 'delete',
              data: {id: id},
              success: (data) => {
                this.getData();
                mui.toast('删除成功')
              }
            });
          }
        }, 'div');
      },
    }
  }
</script>
