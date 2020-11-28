<template>
  <div class="bottom-bar">
    <div class="bar-left bar-item">
      <div>
        <i class="icon service"></i>
        <div class="text">客服</div>
      </div>
      <div>
        <i class="icon shop"></i>
        <div class="text">店铺</div>
      </div>
      <div>
        <i class="icon select"></i>
        <div class="text">收藏</div>
      </div>
    </div>
    <div class="bar-right bar-item">
      <div class="cart" @click="addToCart">加入购物车</div>
      <div class="buy">购买</div>
    </div>
  </div>
</template>

<script>
  export default {
    name: "DetailBottomBar",
    methods: {
      addToCart() {
        this.$emit('addToCart')
      }
    }
  }
</script>

<style scoped>
  .bottom-bar {
    height: 58px;
    display: flex;
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: #fff;
  }
  .bar-item {
    flex: 1;
    display: flex;
  }
  .bar-item>div {
    flex: 1;
  }
  .bar-left .text {
    font-size: 13px;
    text-align: center;
  }
  .bar-left .icon {
    display: block;
    width: 22px;
    height: 22px;
    margin: 10px auto 3px;
    background: url("~assets/img/detail/detail_bottom.png") 0 0/100%;
  }
  .bar-left .service {
    background-position: 0 -54px;
  }
  .bar-left .shop {
    background-position: 0 -98px;
  }
  .bar-right{
    line-height: 58px;
    text-align: center;
    font-size: 15px;
  }
  .bar-right .cart {
    background-color: #ffe817;
    color: #333333;
  }
  .bar-right .buy {
    color: #fff;
    background-color: #f69;
  }
</style>
