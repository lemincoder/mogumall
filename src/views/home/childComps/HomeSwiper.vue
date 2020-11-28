<template>
  <swiper>
    <swiper-item v-for="(item, index) in banners">
      <img :src="item.image" alt="" @load="imgLoad">
    </swiper-item>
  </swiper>
</template>

<script>
  import {Swiper, SwiperItem} from 'components/common/swiper'

  export default {
    name: "HomeSwiper",
    components: {
      Swiper,
      SwiperItem
    },
    props: {
      banners: {
        type: Array,
        default: []
      }
    },
    methods: {
      imgLoad() {
        this.$emit('swiperImgLoad')
      }
    }
  }
</script>

<style scoped>

</style>