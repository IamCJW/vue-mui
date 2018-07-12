const mixin = {
  data() {
    return {
      shares: null,//分享列表
    }
  },
  methods: {
    //分享//////
    share() {
      let vueThis = this;
      mui.plusReady(() => {
        let shareBts = [];
        // 更新分享列表
        let ss = vueThis.shares['weixin'];
        if (navigator.userAgent.indexOf('qihoo') < 0) { //在360流应用中微信不支持分享图片
          ss && ss.nativeClient && (shareBts.push({
            title: '微信朋友圈',
            s: ss,
            x: 'WXSceneTimeline'
          }),
            shareBts.push({
              title: '微信好友',
              s: ss,
              x: 'WXSceneSession'
            }));
        }
        ss = vueThis.shares['qq'];
        ss && ss.nativeClient && shareBts.push({
          title: 'QQ',
          s: ss
        });
        // 弹出分享列表
        shareBts.length > 0 ? plus.nativeUI.actionSheet({
          title: '分享',
          cancel: '取消',
          buttons: shareBts
        }, function (e) {
          (e.index > 0) && vueThis.shareAction(shareBts[e.index - 1], false);
        }) : plus.nativeUI.alert('当前环境无法支持分享操作!');
      })
    },
    /**
     * 更新分享服务
     */
    updateSerivces() {
      plus.share.getServices((s) => {
        this.shares = {};
        for (let i in s) {
          let t = s[i];
          this.shares[t.id] = t;
        }
      }, function (e) {
        mui.toast('获取分享服务列表失败：' + e.message);
      });
    },
    /**
     * 分享操作
     * @param {JSON} sb 分享操作对象s.s为分享通道对象(plus.share.ShareService)
     * @param {Boolean} bh 是否分享链接
     */
    shareAction(sb, bh) {
      let vueThis = this;
      if (!sb || !sb.s) {
        mui.toast('无效的分享服务！');
        return;
      }
      let msg = {
        content: '我是分享',
        title: '别拦我我要分享了',
        href: 'https://www.html5plus.org/doc/zh_cn/share.html#plus.share.ShareMessage',
        extra: {
          scene: sb.x
        }
      };
      // 发送分享
      if (sb.s.authenticated) {
        this.shareMessage(msg, sb.s);
      } else {
        sb.s.authorize(function () {
          vueThis.shareMessage(msg, sb.s);
        }, function (e) {
          mui.toast('认证授权失败：' + e.code + ' - ' + e.message);
        });
      }
    },
    /**
     * 发送分享消息
     * @param {JSON} msg
     * @param {plus.share.ShareService} s
     */
    shareMessage(msg, s) {
      s.send(msg, function () {
        mui.toast('分享到"' + s.description + '"成功！');
      }, function (e) {
        mui.toast('分享到"' + s.description + '"失败: ' + JSON.stringify(e));
      });
    }
  }
};

export default mixin
