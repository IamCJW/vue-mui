import axios from 'axios'

const myMethods = {
  // 跳转页面
  openWindow(route, data) {
    mui.openWindow({
      url: `./${route}.html`,
      id: route,
      extras: data
    })
  }

};

export default myMethods
