<template>
  <div class="cart-bottom">
    <div class="check-content">
      <check-button class="check-all" :is-checked="isCheckAll" @click.native="checkAll"/>
      <div class="text">全选</div>
    </div>
    <div class="total-price">
      合计:{{totalPrice}}
    </div>
    <div class="all-count" @click="toCount">
      去计算{{totalCount}}
    </div>
  </div>
</template>

<script>
  import CheckButton from "./CheckButton";
  import { mapGetters } from 'vuex'

  export default {
    name: "CartBottom",
    components: {
      CheckButton
    },
    computed: {
      totalPrice() {
        return this.$store.state.cartList.filter(item => {
          return item.checked
        }).reduce((preValue, item) => {
          return preValue + item.price * item.count
        },0)
      },
      totalCount() {
        const arr = this.$store.state.cartList.filter(item => {
          return item.checked
        })
        return arr.length
      },
      ...mapGetters([
        'cartList',
        'cartCount'
      ]),
      isCheckAll() {
        if (this.cartCount === 0) return false
        //方法1
        // return !(this.cartList.filter(item => !item.checked).length)
        //方法2
        // return !this.cartList.find(item => !item.checked)
        //方法3
        for (let item of this.cartList) {
          if (!item.checked) return false
        }
        return true
      }
    },
    methods: {
      checkAll() {
        if (this.isCheckAll) {
          for (let item of this.cartList) {
            item.checked = false
          }
        }else {
          for (let item of this.cartList) {
            item.checked = true
          }
        }
      },
      toCount() {
        this.$toast.show('结算中')
      }
    }
  }
</script>

<style scoped>
  .cart-bottom {
    position: relative;
    height: 40px;
    line-height: 40px;
    display: flex;
    width: 100%;
    box-shadow: 0px -2px 3px rgba(0,0,0,.2);
    background-color: #fff;

  }
  .check-content {
    display: flex;
    align-items: center;
    width: 80px;
  }
  .check-content .text {
    margin-left: 10px;
  }
  .check-all {
    width: 20px;
    height: 20px;
    line-height: 0px;
  }
  .total-price {
    flex: 1;
    text-align: center;
  }
  .all-count {
    width: 100px;
    background-color: orange;
    text-align: center;
  }
</style>
