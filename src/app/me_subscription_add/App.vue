<template lang="pug">
  #app
    .mui-content
      ul.media-view
        li.media(@tap="openWindow('subscription_selectLocation')")
          .media-content.iconfont.icon-right {{location.province ? location.province+location.city+location.district : '请选择订阅区域'}}
        li.media(@tap="openWindow('subscription_selectQualification')")
          .media-content.iconfont.icon-right
            .qualify-group
              .qualify-title
                span 订阅资质选择
              .qualify-item(v-for="item in qualifyList", v-if="selectedQualify[item.rid]")
                span {{item.name}}-{{item.level}}
        li.media
          .media-content.flex
            span.fl 订阅状态{{status ? '已开启' : '已关闭'}}
            switchBox.fr(:status="status", :key-name="'status'", @changeStatus="upStatus")
      .fixed-bottom-btn(@tap="save") 保存
</template>
<style lang="stylus" scoped>
  @import "subscription_add.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'

  export default {
    name: 'subscription_add',
    data() {
      return {
        noneData: false,//判断是否有值
        status: true,
        location: {},
        chooseQualification:[],
        selectedQualify:{},
        qualifyList:[],
      }
    },
    components: {
      switchBox: switchBox,
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('chooseLocation', (e) => {
        vueThis.location = e.detail.location;
      });
      window.addEventListener('chooseQualification', (e) => {
        vueThis.chooseQualification = e.detail.data;
        vueThis.selectedQualify = e.detail.selectedQualify;
      });
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_qualify,
          success: (data) => {
            this.qualifyList = data;
          }
        });
      },//更新开关的值
      upStatus(data) {
        this[data.key] = data.value
      },
      save(){
        http({
          url:api.member_subscribe,
          method:'post',
          data:{
            province:this.location.province,
            city:this.location.city,
            district:this.location.district,
            qualify_info:this.chooseQualification
          },
          success:()=>{
            let view = plus.webview.currentWebview().opener();
            mui.fire(view, 'addSuccess', {
              msg: '修改成功'
            });
            mui.back();
          }
        })
      },openWindow:myMethods.openWindow
    }
  }
</script>
