import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cartList: []
  },
  mutations: {
  },
  getters: {
    cartList(state) {
      return state.cartList
    },
    cartCount(state) {
      return state.cartList.length
    }
  },
  actions: {
    addToCart(context, payload) {

      return new Promise(resolve => {

        const oldProduct = context.state.cartList.find(item => item.iid === payload.iid)

        if (oldProduct) {
          oldProduct.count++
          resolve('该商品数量加一')
        } else {
          payload.count = 1
          context.state.cartList.push(payload)
          resolve('该商品已加入购物车')
        }
        console.log(context.state.cartList);
      })
    }
  },
  modules: {
  }
})
