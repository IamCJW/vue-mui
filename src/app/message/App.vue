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
      .content-wrapper
        .content-full-scroll(ref='barscroll')
          .content-page(@swipeleft="contentSwipeleft()")
            .scroll-wrapper#page1
              .scroll-box
                ul.media-view
                  li.media(v-for="(item,index) in subscribeData.data", :class="{active:item.readed === 0}", @longtap="deleteMes(item.rid,item.index,1)", @tap="goToDetail(msg_type,rid)")
                    .media-content
                      .module-top.overflow-auto
                        .fl {{item.msg_type_text}} / {{item.info_type}}
                        .fr
                          i.iconfont.icon-time
                          span {{item.info_date}}
                      .module-content {{item.title}}
          .content-page(@swiperight="contentSwiperight()")
            .scroll-wrapper#page2
              .scroll-box
                ul.media-view
                  li.media(v-for="(item,index) in systemData.data", :class="{active:item.readed === 0}", @longtap="deleteMes(item.rid,item.index,0)")
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

  export default {
    name: 'message',
    data() {
      return {
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
            systemData: [{key: '全部', value: 0}, {key: '系统通知', value: 1}, {key: '订单通知', value: 2}]
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
    mounted() {
      let vueThis = this;
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
                }, success: (data) => {
                  vueThis.subscribeData.data = vueThis.subscribeData.data.concat(data.result);
                  if (data.total_page === vueThis.subscribeData.pageNum) {
                    this.endPullupToRefresh(true);
                  } else {
                    this.endPullupToRefresh(false);
                  }
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
                }, success: (data) => {
                  vueThis.systemData.data = vueThis.systemData.data.concat(data.result);
                  if (data.total_page === vueThis.systemData.pageNum) {
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
      this.jumpTo(this.pageFlag);
    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {
        http({
          url: api.message_subscribe_notify,
          success: (data) => {
            this.subscribeData.data = data.result;
            console.log(this.subscribeData)
          }
        });
        http({
          url: api.message_system_notify,
          success: (data) => {
            this.systemData.data = data.result;
          }
        })
      }
      ,
      //页面切换
      jumpTo(key) {
        this.pageFlag = key;
        let leftValue = 100 * key;
        this.$refs.barscroll.style.left = `-${leftValue}vw`;
        console.log(this.$refs.barscroll.style.left)
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
              data: {rid: id},
              success: (data) => {
                if (type === 1) {
                  vueThis.subscribeData.data.splice(index, 1)
                } else {
                  vueThis.systemData.data.splice(index, 1)
                }
              }
            })
          }
        })
      },
      showFilter() {
        this.filterMsg.flag = !this.filterMsg.flag;
      },
      selectFilter(key) {
        console.log(this.filterMsg.flag)
        this.filterMsg.flag = !this.filterMsg.flag;
        console.log(this.filterMsg.flag)
        if (this.pageFlag === 0 && this.filterMsg.subscribeFlag !== key) {
          this.filterMsg.subscribeFlag = key;
          http({
            url: api.message_subscribe_notify,
            data: {msg_type: key},
            success: (data) => {
              this.subscribeData.data = data.result;
            }
          });
        } else if (this.pageFlag === 1 && this.filterMsg.systemFlag !== key) {
          this.filterMsg.systemFlag = key;
          http({
            url: api.message_system_notify,
            data: {msg_type: key},
            success: (data) => {
              this.systemData.data = data.result;
            }
          });
        }
      },
      openWindow: myMethods.openWindow,//消息跳转详情
      goToDetail(type, rid) {
        let id = rid;
        switch (type) {
          case 1:
            openWindow('detail',{rid:id});
            break;
          case 2:
            openWindow('companyDetail',{rid:id});
            break;
          case 3:
            openWindow('builderDetail',{rid:id});
            break;
          case 4:
            openWindow('companyDetail',{rid:id});
            break;
        }
      }
    }
  }
</script>
