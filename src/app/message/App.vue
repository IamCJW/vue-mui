<template lang="pug">
  #app
    header.search-header
      .search-nav-list
        .search-item(:class="{active: pageFlag === 0}", @tap="jumpTo(0)")
          span 关注消息&nbsp;
          i.iconfont(@tap="showFilter()", :class="[filterMsg.flag &&  pageFlag === 0 ? 'icon-TRIANGLE-copy':'icon-TRIANGLE']")
        .search-item(:class="{active: pageFlag === 1}", @tap="jumpTo(1)")
          span 系统消息&nbsp;
          i.iconfont(@tap="showFilter()", :class="[filterMsg.flag &&  pageFlag === 1 ? 'icon-TRIANGLE-copy':'icon-TRIANGLE']")
    .mui-content
      loading(ref="loading")
      warn(v-if="connectionState", :remakeDo="true")
      template(v-if="unToken")
        warn(icon="icon-news-copy", msg="该功能需登录才能使用~")
        button.mid-btn(@tap="openWindow('login')") 前往登录
      .content-wrapper(v-show="dataLock && !unToken")
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()", @swiperight="openTabNav('home',0)")
            .scroll-wrapper#page1
              .scroll-box
                warn(v-show="!subscribeData.data.length", icon="icon-news-copy", msg="暂无关注消息~")
                ul.media-view(v-show="subscribeData.data.length")
                  transition-group(name="domItem")
                    li.media(v-for="(item,index) in subscribeData.data", :key="item.rid" ,:class="{active:item.readed === 0}", @longtap="deleteMes(item.rid,item.index,1)", @tap="goToDetail(item.msg_type,{rid:item.ref_id,type:item.info_type})")
                      .media-content
                        .module-top.overflow-auto
                          .fl {{item.msg_type_text}} / {{item.info_type}}
                          .fr
                            i.iconfont.icon-time
                            span {{item.info_date}}
                        .module-content {{item.title}}
          .content-page(@swiperight="contentSwiperight()", @swipeleft="openTabNav('search',2)")
            .scroll-wrapper#page2
              .scroll-box
                warn(v-show="!systemData.data.length",icon="icon-news-copy",msg="暂无系统消息~")
                ul.media-view(v-show="systemData.data.length")
                  transition-group(name="domItem")
                    li.media(v-for="(item,index) in systemData.data", :key="item.rid" ,:class="{active:item.readed === 0}", @longtap="deleteMes(item.rid,item.index,0)")
                      .media-content
                        .module-top.overflow-auto
                          .fl {{item.msg_type_text}}
                          .fr
                            i.iconfont.icon-time
                            span {{item.info_date}}
                        .module-content {{item.title}}
        .type-message.mask(v-if="filterMsg.flag", @tap="showFilter")
          .popout
            .filter-box
              .module(v-if="pageFlag === 0")
                button(v-for="item in filterMsg.data.subscribeData", @tap.stop="selectFilter(item.value)", :class="{active:filterMsg.subscribeFlag === item.value}") {{item.key}}
              .module(v-if="pageFlag === 1")
                button(v-for="item in filterMsg.data.systemData", @tap.stop="selectFilter(item.value)", :class="{active:filterMsg.systemFlag === item.value}") {{item.key}}
</template>
<style lang="stylus" scoped>
  @import "message.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'
  import loading from '../../components/loading'
  import Warn from "../../components/warn"

  export default {
    name: 'message',
    data() {
      return {
        unToken:true,
        dataLock: false,
        pageFlag: 0,
        filterMsg: {
          flag: false,
          subscribeFlag: 0,
          systemFlag: 0,
          data: {
            subscribeData: [{key: '全部', value: 0}, {key: '项目动态', value: 1}, {key: '企业动态', value: 2}, {
              key: '建造师动态',
              value: 3
            }, {key: '业主动态', value: 4}],
            systemData: [{key: '全部', value: 0}, {key: '系统通知', value: 6}, {key: '订单通知', value: 7}]
          }
        },
        subscribeData: {
          pageNum: 1,
          data: {}
        },
        systemData: {
          pageNum: 1,
          data: {}
        }
      }
    },
    components: {
      Warn,
      loading: loading
    },
    mounted() {
      let vueThis = this;
      window.addEventListener('changeTabNav',()=>{
        this.getData();
      });
      window.addEventListener('readed',()=>{
        this.getData();
      });
      window.addEventListener('getData', () => {
        this.getData();
        myMethods.uploadReset('#page1');
        this.subscribeData.pageNum = 1;
      });
      window.addEventListener('loginSuccess', () => {
        this.getData();
      });
      window.addEventListener('loginOut', () => {
        this.dataLock = false;
        this.unToken = true;
      });
      mui.init({
        gestureConfig: {
          longtap: true, //默认为false
        },
        pullRefresh: [{
          container: '#page1',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.subscribeData.pageNum += 1;
              http({
                url: api.message_subscribe_notify,
                data: {
                  cur_page: vueThis.subscribeData.pageNum,
                  msg_type: vueThis.filterMsg.subscribeFlag,
                }, success: (data) => {
                  if (data.total_page < vueThis.subscribeData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.subscribeData.data = vueThis.subscribeData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind: () => {
                  this.endPullupToRefresh(true);
                },
                connectionNone:()=>{
                  vueThis.subscribeData.pageNum -= 1;
                  this.endPullupToRefresh(true);
                }
              });
            }
          }
        }, {
          container: '#page2',
          up: {
            contentrefresh: "正在加载...",
            callback: function () {
              vueThis.systemData.pageNum += 1;
              http({
                url: api.message_system_notify,
                data: {
                  cur_page: vueThis.systemData.pageNum,
                  msg_type: vueThis.filterMsg.systemFlag,
                },
                success: (data) => {
                  if (data.total_page < vueThis.systemData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    vueThis.systemData.data = vueThis.systemData.data.concat(data.result);
                    this.endPullupToRefresh(false);
                  }
                },
                noFind: () => {
                  this.endPullupToRefresh(true);
                },
                connectionNone:()=>{
                  vueThis.systemData.pageNum -= 1;
                  this.endPullupToRefresh(true);
                }
              });
            }
          }
        }]
      });
      mui('.mui-scroll-wrapper').scroll({
          deceleration: 0.1,
          indicators: false
        }
      );
    },
    created() {

    },
    methods: {
      //数据请求
      getData() {
        this.$refs.loading.show();
        http({
          url: api.message_subscribe_notify,
          success: (data) => {
            this.subscribeData.data = data.result;
            this.connectionOnline();
            this.unToken = false;
          },
          noFind: () => {
            this.subscribeData.data = [];
            this.connectionOnline();
            this.unToken = false;
          },
          unToken:()=>{
            this.connectionOnline();
            this.unToken = true;
          },
          connectionNone:()=>{
            this.connectionUnline();
          }
        });
        http({
          url: api.message_system_notify,
          success: (data) => {
            this.systemData.data = data.result;
          },
          noFind: () => {
            this.systemData.data = [];
          }
        })
      }
      ,
      //页面切换
      jumpTo(key) {
        this.pageFlag = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
      },
      //左滑事件
      contentSwipeleft() {
        this.pageFlag = this.pageFlag + 1;
        let key = this.pageFlag;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      //右滑事件
      contentSwiperight() {
        this.pageFlag = this.pageFlag - 1;
        let key = this.pageFlag;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`
      },
      deleteMes(id, index, type) {
        let vueThis = this;
        mui.confirm('确定删除该消息', ' ', ['取消', '确定'], (e) => {
          if (e.index === 1) {
            http({
              url: api.message_del,
              data: {code: id},
              method:'post',
              success: (data) => {
                if (type === 1) {
                  vueThis.subscribeData.data.splice(index, 1)
                } else {
                  vueThis.systemData.data.splice(index, 1)
                }
              }
            })
          }
        }, 'div')
      },
      showFilter() {
        this.filterMsg.flag = !this.filterMsg.flag;
      },
      selectFilter(key) {
        this.$refs.loading.show();
        this.filterMsg.flag = !this.filterMsg.flag;
        if (this.pageFlag === 0 && this.filterMsg.subscribeFlag !== key) {
          this.filterMsg.subscribeFlag = key;
          http({
            url: api.message_subscribe_notify,
            data: {msg_type: key},
            success: (data) => {
              this.subscribeData = {
                pageNum: 1,
                data: {}
              };
              this.subscribeData.data = data.result;
              this.$refs.loading.hide();
            },
            noFind: () => {
              this.subscribeData = {
                pageNum: 1,
                data: {}
              };
              this.subscribeData.data = [];
              this.$refs.loading.hide();
            }
          });
        } else if (this.pageFlag === 1 && this.filterMsg.systemFlag !== key) {
          this.filterMsg.systemFlag = key;
          http({
            url: api.message_system_notify,
            data: {msg_type: key},
            success: (data) => {
              this.systemData = {
                pageNum: 1,
                data: {}
              };
              this.systemData.data = data.result;
              this.$refs.loading.hide();
            },
            noFind: () => {
              this.systemData.data = [];
              this.$refs.loading.hide();
            }
          });
        }
      },
      openWindow: myMethods.openWindow,//消息跳转详情
      openTabNav: myMethods.openTabNav,
      goToDetail(type, baseData) {
        let data = baseData;
        if (data.type){
          if (data.type === '中标' ){
            data.type = 2;
          } else {
            data.type = 3;
          }
        }
        switch (type) {
          case 1:
            this.openDetail('detail',data);
            break;
          case 2:
            this.openDetail('companyDetail',data);
            break;
          case 3:
            this.openDetail('builderDetail',data);
            break;
          case 4:
            this.openDetail('companyDetail_own',data);
            break;
        }
      },
      openTabNav: myMethods.openTabNav,
      openDetail:myMethods.openDetail,
    }
  }
</script>
