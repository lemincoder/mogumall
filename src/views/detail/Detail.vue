<template>
  <div id="detail">
    <detail-nav-bar class="nav-bar" @titleClick="titleClick" ref="nav"/>
    <scroll ref="scroll"
            class="content"
            @scroll="contentScroll"
            :pull-up-load="true"
            :probe-type="3">
      <detail-swiper class="detail-swiper" :top-images="topImages"/>
      <detail-base-info :goods="goods"/>
      <detail-shop-info :shop="shopInfo"/>
      <detail-goods-info :detail-info="detailInfo" @imageLoad="imageLoad"/>
      <detail-param-info :param-info="paramInfo" ref="param"/>
      <detail-comment-info :comment-info="commentInfo" ref="comment"/>
      <goods-list :goods="recommends" ref="recommend"/>
    </scroll>
    <detail-bottom-bar class="bottom-bar" @addToCart="addToCart"/>
    <back-top v-show="isShowBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import DetailNavBar from "./childcomps/DetailNavBar";
  import DetailSwiper from "./childcomps/DetailSwiper";
  import DetailBaseInfo from "./childcomps/DetailBaseInfo";
  import DetailGoodsInfo from "./childcomps/DetailGoodsInfo";
  import DetailShopInfo from "./childcomps/DetailShopInfo";
  import DetailCommentInfo from "./childcomps/DetailCommentInfo";
  import DetailParamInfo from "./childcomps/DetailParamInfo";
  import GoodsList from "components/content/goods/GoodsList";
  import DetailBottomBar from "./childcomps/DetailBottomBar";
  import BackTop from "components/content/backTop/BackTop";

  import Scroll from "components/common/scroll/Scroll";

  import {getDetail,Goods,Shop,GoodsParam,getRecommend} from "../../network/detail";
  import {debounce} from "../../common/utils";

  export default {
    name: "Detail",
    components: {
      DetailNavBar,
      DetailSwiper,
      DetailBaseInfo,
      DetailShopInfo,
      DetailGoodsInfo,
      DetailCommentInfo,
      DetailParamInfo,
      Scroll,
      GoodsList,
      DetailBottomBar,
      BackTop,
    },
    data() {
      return {
        iid: null,
        topImages: [],
        detailInfo: [],
        goods: {},
        shopInfo: {},
        detailInfo: {},
        commentInfo: {},
        paramInfo: {},
        recommends: [],
        isShowBackTop: false,
        themeTopYs: []
      }
    },
    created() {

      this.iid = this.$route.params.iid

      //通过iid来请求数据
      getDetail(this.iid).then(res => {

        const data = res.result
        console.log(data);

        this.topImages = data.itemInfo.topImages

        this.goods = new Goods(data.itemInfo, data.columns, data.shopInfo.services)

        this.shopInfo = new Shop(data.shopInfo)

        this.detailInfo = data.detailInfo

        this.paramInfo = new GoodsParam(data.itemParams.info, data.itemParams.rule)

        if (data.rate.cRate !== 0){
          this.commentInfo = data.rate.list[0]
        }
      })

      getRecommend().then(res => {
        this.recommends = res.data.list
      })
    },
    mounted() {
      //使用防抖函数减少页面频繁调用refresh
      this.refresh = debounce(this.$refs.scroll.refresh)

      this.itemImgListener = () => {
        this.refresh()
      }
      //监听图片加载完成
      this.$bus.$on('itemImgLoad', this.itemImgListener)
    },
    methods: {
      //监听图片加载完成
      imageLoad() {
        this.$refs.scroll.refresh()

        this.themeTopYs = []
        this.themeTopYs.push(0)
        this.themeTopYs.push(this.$refs.param.$el.offsetTop)
        this.themeTopYs.push(this.$refs.comment.$el.offsetTop)
        this.themeTopYs.push(this.$refs.recommend.$el.offsetTop)
        this.themeTopYs.push(Number.MAX_VALUE)
      },
      //backtop监听点击
      backClick() {
        this.$refs.scroll.scrollTo(0,0,200)
      },
      //监听scroll滚动事件
      contentScroll(position) {
        const positionY = -position.y

        let length = this.themeTopYs.length
        for (let i = 0; i < length; i++) {
          if (this.currentIndex !== i && (positionY >= this.themeTopYs[i]) && (positionY < this.themeTopYs[i+1])){
            this.currentIndex = i
            this.$refs.nav.currentIndex = this.currentIndex
          }
        }

        //当滚动超过1500px时显示backtop
        this.isShowBackTop = (positionY) > 1500
      },
      //监听顶部点击
      titleClick(index) {
        this.$refs.scroll.scrollTo(0,-this.themeTopYs[index],200)
      },
      //监听加入购物车的点击
      addToCart() {

        //创建一个对象保存购物车页面的信息
        const product = {}

        product.iid = this.iid
        product.image = this.topImages[0]
        product.title = this.goods.title
        product.desc = this.goods.desc
        product.price = this.goods.realPrice

        //选中按钮默认选中
        product.checked = true

        //将购物车页面需要的信息添加到Vuex中
        this.$store.dispatch('addToCart', product).then(res => {

          //toast显示
          this.$toast.show(res)
        })
      }
    }
  }
</script>

<style scoped>
  #detail {
    height: 100vh;
  }

  .nav-bar {
    background-color: #ffffff;
  }

  .detail-swiper {
    height: 300px;
  }

  .content {
    height: calc(100% - 44px - 58px);
    overflow: hidden;
  }

  .bottom-bar {
    position: relative;
    left: 0;
    right: 0;
    bottom: 0;
    z-index: 9;
  }
</style>