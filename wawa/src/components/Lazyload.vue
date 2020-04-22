<template>
  <div class="lazy-img">
    <div v-for="item in imgs" :key="item.src">
      <img v-lazy="item.src" />
    </div>
  </div>
</template>

<script>
export default {
  name: 'Lazyload',
  props: {
    msg: String
  },
  data() {
    return {
      imgs: [
        {
          src: 'https://goss.veer.com/creative/vcg/veer/1600water/veer-153835898.jpg'
        },
        {
          src: 'https://goss.veer.com/creative/vcg/veer/1600water/veer-151072756.jpg',
        },
        {
          src: 'https://goss.veer.com/creative/vcg/veer/1600water/veer-153073222.jpg',
        },
        // {
        //   src: 'https://images.unsplash.com/photo-1492019047981-388117d0e57d?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1050&q=80',
        // },
        // {
        //   src: 'https://images.unsplash.com/photo-1434064511983-18c6dae20ed5?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1051&q=80',
        // }
      ]
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="stylus" scoped>
.lazy-img 
  img
    width 100%
</style>
