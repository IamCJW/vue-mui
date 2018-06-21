import axios from 'axios'

const myMethods = {
    // 正则表达式，
    regexPhone(phone) {
      let regex = /^[1][3,4,5,7,8][0-9]{9}$/;
      if (regex.test(phone)) {
        return true
      } else {
        return false
      }
    },// 验证码定时器
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
    openWindowNView(url) {
      mui.openWindow({
        url: `./${url}.html`,
        id: url,
        styles: {                             // 窗口参数 参考5+规范中的WebviewStyle,也就是说WebviewStyle下的参数都可以在此设置
          titleNView: {                       // 窗口的标题栏控件
            titleColor: "#ffffff",             // 字体颜色,颜色值格式为"#RRGGBB",默认值为"#000000"
            titleSize: "16px",                 // 字体大小,默认17px
            backgroundColor: "#04a3ee",        // 控件背景颜色,颜色值格式为"#RRGGBB",默认值为"#F7F7F7"
            progress: {                        // 标题栏控件的进度条样式
              color: "#f4d10d",                // 进度条颜色,默认值为"#00FF00"
              height: "2px"                    // 进度条高度,默认值为"2px"
            },
            autoBackButton: true,
          }
        }
      })
    },
    NVpreload(arr){
      mui.plusReady(() => {
        let Arr = arr
        Arr.forEach((item)=>{
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
