<template>
    <scroll class="content">
      <div>
        <cart-list-item v-for="(item, index) in cartList" :item-info="item" :key="index"></cart-list-item>
      </div>
    </scroll>
</template>

<script>
  import CartListItem from "./CartListItem";

  import Scroll from "components/common/scroll/Scroll";

  export default {
    name: "cartList",
    components: {
      CartListItem,
      Scroll
    },
    props: {
      cartList: Array
    }
  }
</script>

<style scoped>
  .content {
    height: 100%;
    overflow: hidden;
  }
</style>
