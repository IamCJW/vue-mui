import axios from 'axios'

const myMethods = {
  // 正则表达式，
  regexPhone(phone){
    let regex = /^[1][3,4,5,7,8][0-9]{9}$/;
    if(regex.test(phone)){
      return true
    }else {
      return false
    }
  },// 验证码定时器
  timeClock(text,time,flag){
    text = `${time}s后获取`;
    let clock = window.setInterval(()=>{
      time --;
      text = `${time}s后获取`;
      if(time < 1){
        window.clearInterval(clock);
        text='重新获取';
        flag=false;
      }
    },1000)
  },
  // 跳转页面
  openWindow(route, data) {
    mui.openWindow({
      url: `./${route}.html`,
      id: route,
      extras: data
    })
  },
  //获取页面传值
  getMuiExtras(){
    let self = plus.webview.currentWebview();
    return self;
  }
};

export default myMethods
