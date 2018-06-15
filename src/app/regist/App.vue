<template lang="pug">
  #app
    header.header-nav
      span.mui-action-back.iconfont.icon-return
      .header-title 新用户注册
    .mui-content
      .box
        .input-group
          .input-item
            i.iconfont.icon-shouji
            input(placeholder="请输入手机号" type="tel" maxlength="11" v-model="phone" @input="changeValue")
          .input-item
            i.iconfont.icon-yanzhengma
            input(placeholder="请输入验证码" type="tel" v-model="code" @input="changeValue")
            span.code(:class="{disabled:codeFlag}") {{codeText}}
        .tip(v-show="phoneFlag") 我们已给手机号码
          span {{phone}}
          | 发送了一条4位数验证码
        .tip(v-show="!phoneFlag") 请输入11位手机号码
        button.mid-btn(@tap="next" :disabled="btnDisable" :class="{disabled:btnDisable}") 下一步
</template>
<style lang="stylus" scoped>
  @import "regist.styl"
</style>
<script>
  /* global mui */
  /* global mui plus */
  import myMethods from '../../assets/js/methods'
  import http from '../../assets/js/http.js'
  import api from '../../assets/js/api.js'

  export default {
    name: 'login',
    data() {
      return {
        code: '',
        phone: '',
        phoneFlag: false,
        btnDisable: true,
        first: true,
        codeText: '重新获取',
        totalTime: '10',
        codeFlag: true
      }
    },
    mounted() {

    },
    created() {
      this.getData();
    },
    methods: {
      //数据请求
      getData() {

      },//打开页面
      openWindow: myMethods.openWindow,
      changeValue() {
        if (myMethods.regexPhone(this.phone) && this.first) {
          this.first = false;
          this.phoneFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            method: 'post',
            data: {
              mobile_no: this.phone
            },
            success() {
              mui.toast('获取成功')
            }
          })
        } else {
          this.phoneFlag = false;
        }
        if (myMethods.regexPhone(this.phone) && this.code.length === 4) {
          this.btnDisable = false;
        } else {
          this.btnDisable = true
        }
      },// 验证码定时器
      timeClock() {
        this.codeText = `${this.totalTime}s后获取`;
        let clock = window.setInterval(() => {
          this.totalTime--;
          this.codeText = `${this.totalTime}s后获取`;
          if (this.totalTime < 1) {
            window.clearInterval(clock);
            this.codeText = '重新获取';
            this.codeFlag = false;
          }
        }, 1000)
      },
      // 获取验证码
      getCode() {
        if (!this.codeFlag) {
          this.codeFlag = true;
          this.timeClock();
          http({
            url: api.common_sendcode,
            data: {
              mobile_no: this.phone
            },
            method: 'post',
            success: () => {
              mui.toast('获取成功')
            }
          })
        }
      },//下一步
      next(){
        http({
          url:api.common_verify_code,
          data:{
            code:this.code,
            mobile_no:this.phone
          },
          method:'post',
          success(){
            myMethods.openWindow('regist_next')
          }
        })
      }
    }
  }
</script>
