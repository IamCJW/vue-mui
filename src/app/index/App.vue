<template lang="pug">

</template>
<style lang="stylus">
  .color {
    color: #2ac845;
  }
</style>

<script>
  /* global mui */
  export default {
    name: 'index',
    data() {
      return {}
    },
    mounted() {
      let navHeight = changeRem(0.45);
      mui.init({
        wipeBack: true,
        subpages: [{
          url: './home.html',
          id: 'home',
          styles: {
            top: 0,
            bottom: navHeight,
            zindex: 1
          }
        }, {
          url: './nav.html',
          id: 'nav',
          styles: {
            bottom: 0,
            height: navHeight,
            zindex: 9
          }
        }]
      })
    },
    methods: {
      changeRem: function (rem) {
        let windowWidth = document.documentElement.clientWidth;
        let px = windowWidth * 0.26667 * rem;
        return `${px}px`;
      }
    }
  }
</script>
