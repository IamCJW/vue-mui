import axios from 'axios'

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
    //设置导航栏颜色
    setStatusbar: (function () {
      mui.plusReady(() => {
        plus.navigator.setStatusBarBackground('#04a3ee');
      })
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
      mui.plusReady(function () {
        let detailPage = plus.webview.getWebviewById(url);
        mui.fire(detailPage, 'getData', data);
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
    }
  }
;

export default myMethods
