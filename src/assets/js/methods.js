import {plusKey} from "./locationStorage";

const myMethods = {
  // 电话验证正则表达式，
  regexPhone(phone) {
    let regex = /^[1][3,4,5,7,8][0-9]{9}$/;
    if (regex.test(phone)) {
      return true
    } else {
      return false
    }
  },
  regexPhoneAndMobile(phone) {
    let regex = /^(0?(13[0-9]|15[012356789]|17[013678]|18[0-9]|14[57])[0-9]{8})|(400|800)([0-9\\-]{7,10})|(([0-9]{4}|[0-9]{3})(-| )?)?([0-9]{7,8})((-| |转)*([0-9]{1,4}))?$/;
    if (regex.test(phone)) {
      return true
    } else {
      return false
    }
  },
  // 验证码定时器
  timeClock(text, time, flag) {
    text = `${time}s后获取`;
    let clock = window.setInterval(() => {
      time--;
      text = `${time}s后获取`;
      if (time < 1) {
        window.clearInterval(clock);
        text = '重新获取';
        flag = false;
      }
    }, 1000)
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
  getMuiExtras() {
    let self = plus.webview.currentWebview();
    return self;
  },
  //初始化plus内容
  loadedInit: (function () {
    mui.plusReady(() => {
      //设置导航栏颜色
      plus.navigator.setStatusBarBackground('#04a3ee');
      //重定义返回事件
      let oldBack = mui.back;
      mui.back = function () {
        mui.plusReady(()=>{
          plus.key.hideSoftKeybord();
          oldBack();
        });
      }
    });
  })(),
  //预加载页面，并打开页面
  openNViewPreload(url, data) {
    mui.preload({
      url: `./${url}.html`,
      id: url,
      styles: {
        titleNView: {
          titleColor: "#ffffff",
          titleSize: "16px",
          backgroundColor: "#04a3ee",
          progress: {
            color: "#f4d10d",
            height: "2px"
          },
          autoBackButton: true,
        }
      }
    });
    mui.plusReady(() => {
      let detailPage = plus.webview.getWebviewById(url);
      myMethods.muiFireLock(detailPage, () => {
        mui.fire(detailPage, 'getData', data);
      });
      mui.openWindow(url);
    });
  },
  //原生导航头预加载
  NVpreload(arr) {
    mui.plusReady(() => {
      let Arr = arr;
      Arr.forEach((item) => {
        mui.preload({
          url: `./${item}.html`,
          id: item,
          styles: {
            titleNView: {
              titleColor: "#ffffff",
              titleSize: "16px",
              backgroundColor: "#04a3ee",
              progress: {
                color: "#f4d10d",
                height: "2px"
              },
              autoBackButton: true,
            }
          }
        });
      });
    });
  },
  //修正尺寸单位
  changeRem: function (rem) {
    let windowWidth = document.documentElement.clientWidth;
    let px = windowWidth * 0.26667 * rem;
    return `${px}px`;
  },
  //主页跳转
  openTabNav(id, index) {
    if (plus.storage.getItem(plusKey.state) === null && index === 1) {
      mui.toast('该功能需要登录才能访问~');
      myMethods.openWindow('login');
      return
    }
    mui.plusReady(() => {
      let main = plus.webview.currentWebview().opener();
      let openView = plus.webview.getWebviewById(id);
      plus.webview.show(id, 'fade-in', 300);
      myMethods.muiFireLock(openView, () => {
        mui.fire(openView, 'changeTabNav', {
          index: index
        });
      });
      myMethods.muiFireLock(main, () => {
        mui.fire(main, 'changeTabNav', {
          index: index
        });
      })
    });
  },
  openDetail(url, data) {
    mui.plusReady(function () {
      mui.preload({
        url: `./${url}.html`,
        id: url
      });
      let detailPage = plus.webview.getWebviewById(url);
      myMethods.muiFireLock(detailPage, () => {
        mui.fire(detailPage, 'getData', data);
      });
      myMethods.openWindow(url);
    });
  },
  //muiFire异步加锁事件/////////////////////////
  muiFireLock(view, fun) {
    if (mui.os.ios){
      view.addEventListener('loaded', function () {
        fun();
      });
      fun();
    }else {
      fun();
    }
  },
  //返回/////////////////////////////
  muiOldBack() {
    mui.back();
  },
  /*
  * domId:节点参数
  * */
  uploadReset(domId){
    mui(domId).pullRefresh().refresh(true);
    mui(domId).pullRefresh().scrollTo(0,0,0);
  }
};

export default myMethods
