<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 订阅资历选择
    .mui-content
      template(v-if="qualificationData.length === 0")
        .none
          i.iconfont.icon-subscription
          span 暂无可选择资质~
        button.mid-btn(@tap="openWindow('selectQualifys')") 添加资质
      template(v-if="qualificationData.length !== 0")
        ul.media-view
          li.media(v-for="item in qualificationData")
            .media-content.flex
              span.fl {{item.name}}-{{item.level}}
              switchBox.fr(:status="qualificationSelected[item.rid]", :keyName="item.rid", @changeStatus="upStatus")
        .fixed-bottom-btn(@tap="selectBack") 确定
</template>
<style lang="stylus" scoped>
  @import "subscription_selectQualification.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import switchBox from '../../components/switch.vue'

  export default {
    name: 'subscription_selectQualification',
    data() {
      return {
        qualificationData: [],
        qualificationSelected: {},
        subscription: '',
      }
    },
    components: {
      switchBox: switchBox,
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('getData',(e)=>{
        this.subscription = e.detail;
        this.getData();
      });
      window.addEventListener('chooseCategory',()=>{
        this.getData();
      })
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.member_qualify,
          success: (data) => {
            this.qualificationData = data;
            data.forEach((item) => {
              this.$set(this.qualificationSelected, item.rid, 0);
            });
          }
        });
      },//更新开关的值
      upStatus(data) {
        this.$set(this.qualificationSelected, data.key, data.value);
        console.log(this)
      },//确定按钮
      selectBack() {
        let data = [];
        let i = 0;
        for (let item in  this.qualificationSelected) {
          data[i] = {
            rid: item,
            status: this.qualificationSelected[item] ? 1 : 0
          };
          i++;
        }
        if (this.subscription.id) {
          http({
            url: api.member_subscribe,
            method: 'post',
            data: {
              province: this.subscription.province,
              city: this.subscription.city,
              district: this.subscription.district,
              qualify_info: data,
              rid: this.subscription.id
            },
            success() {
              let view = plus.webview.currentWebview().opener();
              mui.fire(view, 'chooseQualification', {
                msg: '修改成功'
              });
              mui.back();
            }
          })
        } else {
          let view = plus.webview.currentWebview().opener();
          mui.fire(view, 'chooseQualification', {
            data: data,
            selectedQualify: this.qualificationSelected
          });
          mui.back();
        }
      },
      openWindow:myMethods.openWindow,
    }
  }
</script>
