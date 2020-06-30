<template>
  <div class="lazy-img">
    <!-- <div class="empty-block">123</div>
    <div class="empty-block">123</div>
    <div class="empty-block">123</div> -->
    <!-- <div class="empty-block">123</div> -->
    <img v-for="(item, index) in imgs" :key="index" v-lazy="{ src: item.src, errorCb: imgError, successCb: imgSuccess, param: { floor: index } }" />
    <img v-lazy="{ src: 'https://images.unsplash.com/photo-1497282003564-004631e01464?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80', unUseLazy: true, errorCb: imgError, successCb: imgSuccess, param: {name: 'aaaaa'}}">
    <img v-lazy="{ src: 'https://images.unsplash.com/photo-1492019047981-388117d0e57d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80', loadDirectly: true }" alt="">
    <img v-lazy="'https://images.unsplash.com/photo-1492019047981-388117d0e57d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'" alt="">
    <div class="empty-block">123</div>
    <div class="empty-block">123</div>
    <!-- <button @click="changeImage">change</button> -->
  </div>
</template>

<script>
export default {
  name: 'HelloWorld',
  props: {
    msg: String
  },
  created() {
    // this.$Lazyload.$on('error', (args) => {
    //   console.log('on', args)
    // })
    // this.$Lazyload.$once('error', (args) => {
    //   console.log('once', args)
    // })
  },
  data() {
    return {
      imgs: [
        {
          src: 'https://images.unsplash.com/photo-1570539144352-69145033504c?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1048&q=80'
        },
        // {
        //   src: 'https://1.png',
        // },
        {
          src: 'https://images.unsplash.com/photo-1474518551598-147ee65f265e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        },
        // {
        //   src: 'https://images.unsplash.com/photo-1497282003564-004631e01464?ixlib=rb-1.2.1&auto=format&fit=crop&w=634&q=80',
        // },
        // {
        //   src: 'https://images.unsplash.com/photo-1474518551598-147ee65f265e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        // },
        // {
        //   src: 'https://images.unsplash.com/photo-1492019047981-388117d0e57d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        // },
        // {
        //   src: 'https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
        // }
      ]
    }
  },
  methods: {
    changeImage() {
      this.imgs.push({
        src: 'https://images.unsplash.com/photo-1474518551598-147ee65f265e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80'
      })
      // this.imgs.push({
      //   src: 'https://images.unsplash.com/photo-1474518'
      // })
    },
    imgError(args) {
      console.log('error', args)
    },
    imgSuccess(args) {
      console.log('success', args)
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.lazy-img
  .empty-block
    height 50vh
  img
    display block
    width 150px
    height 150px
  button
    position fixed
    left 0
    bottom 0
    display block
    width 100%
    height 45px
    line-height 45px
</style>
