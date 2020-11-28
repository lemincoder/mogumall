<template>
  <div id="cart">
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{cartCount}})</div>
    </nav-bar>
    <cart-list :cart-list="cartList" class="cart-list"></cart-list>
    <cart-bottom class="cart-bottom"></cart-bottom>
  </div>
</template>

<script>
  import CartList from "./childcomps/CartList";
  import CartBottom from "./childcomps/CartBottom";
  import NavBar from "components/common/navbar/NavBar";

  export default {
    name: "Cart",
    components: {
      NavBar,
      CartList,
      CartBottom
    },
    created() {

    },
    computed: {
      cartList() {
        return this.$store.state.cartList
      },
      cartCount() {
        return this.$store.state.cartList.length
      }
    }
  }
</script>

<style scoped>
  .nav-bar {
    background-color: var(--color-tint);
    color: #ffffff;
  }
  .nav-bar {
    position: relative;
    top: 0;
    left: 0;
    right: 0;
  }
  .cart-list {
    height: calc(100vh - 44px - 49px - 40px);
  }
</style>