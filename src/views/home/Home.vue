<template>
  <div id="home">
    <nav-bar  class="nav-bar">
      <div slot="center">购物街</div>
    </nav-bar>
    <tab-control :titles="['流行', '新款', '精选']"
                 @tabClick="tabClick"
                  ref="tabControl2"
                  class="tab-control"
                  v-show="ifTabFixed"/>
    <scroll class="content"
            ref="scroll"
            @scroll="contentScroll"
            @pullingUp="loadMore"
            :pull-up-load="true"
            :probe-type="3">
      <home-swiper :banners="banners" @swiperImgLoad="swiperImgLoad"/>
      <recommend-view :recommend="recommend"/>
      <feature-view/>
      <tab-control :titles="['流行', '新款', '精选']"
                   @tabClick="tabClick"
                   ref="tabControl1"/>
      <goods-list :goods="showGoods"/>
    </scroll>
    <back-top v-show="isShowBackTop" @click.native="backClick"/>
  </div>
</template>

<script>
  import NavBar from "components/common/navbar/NavBar";
  import Scroll from "components/common/scroll/Scroll";
  import GoodsList from "components/content/goods/GoodsList";
  import BackTop from "components/content/backTop/BackTop";

  import HomeSwiper from "./childComps/HomeSwiper";
  import RecommendView from "./childComps/RecommendView";
  import FeatureView from "./childComps/FeatureView";
  import TabControl from "components/common/tabControl/TabControl";

  import {getHomeMultidata, getHomeGoods} from "../../network/home";
  import {debounce} from "../../common/utils";

  export default {
    name: "Home",
    components: {
      NavBar,
      HomeSwiper,
      RecommendView,
      FeatureView,
      Scroll,
      TabControl,
      GoodsList,
      BackTop
    },
    data() {
      return {
        banners: [],
        recommend: [],
        goods: {
          'pop' : {page: 0, list: []},
          'new' : {page: 0, list: []},
          'sell' : {page: 0, list: []}
        },
        currentType: 'pop',
        ifTabFixed: false,
        tabOffsetTop: 0,
        isShowBackTop: false,
        saveY: 0
      }
    },
    created() {
      this.getHomeMultidata()

      this.getHomeGoods('pop')
      this.getHomeGoods('new')
      this.getHomeGoods('sell')


    },
    mounted() {
      //监听item中图片加载完成
      this.refresh = debounce(this.$refs.scroll.refresh)

      this.itemImgListener = () => {
        this.refresh()
      }
      //监听图片加载完成
      this.$bus.$on('itemImgLoad', this.itemImgListener)
    },
    activated() {
      //读取离开页面最后的位置，回到该位置
      this.$refs.scroll.scrollTo(0, this.saveY)

      this.$refs.scroll.refresh()
    },
    deactivated() {
      //离开Home页面时，保存最后的位置
      this.saveY = this.$refs.scroll.getScrollY()

      //结束事件总线的事件
      this.$bus.$off('itemImgLoad', this.itemImgListener)
    },
    methods: {
      tabClick(index) {
        switch (index) {
          case 0 :
            this.currentType = 'pop'
            break;
          case 1 :
            this.currentType = 'new'
            break;
          case 2 :
            this.currentType = 'sell'
        }
        //使两个tabControl显示一样
        this.$refs.tabControl1.currentIndex = index
        this.$refs.tabControl2.currentIndex = index
      },
      //回到顶部
      backClick() {
        this.$refs.scroll.scrollTo(0, 0, 200)
      },

      //监听scroll上拉，加载更多数据
      loadMore() {
        this.getHomeGoods(this.currentType)
        console.log('上拉加载更多');
      },
      //监听scroll滚动事件
      contentScroll(position) {
        this.isShowBackTop = (-position.y) > 1500
        this.ifTabFixed = (-position.y) > this.tabOffsetTop
      },

      //获取轮播图和推荐数据
      getHomeMultidata() {
        getHomeMultidata().then(res => {
          this.banners = res.data.banner.list
          this.recommend = res.data.recommend.list
        })
      },
      //获取商品信息
      getHomeGoods(type) {
        const page = this.goods[type].page + 1
        getHomeGoods(type, page).then(res => {
          this.goods[type].list.push(...res.data.list)
          this.goods[type].page += 1

          //完成下拉加载更多
          this.$refs.scroll.finishPullUp()
        })
      },
      //监听轮播图加载完成
      swiperImgLoad() {
        this.tabOffsetTop = this.$refs.tabControl1.$el.offsetTop
      }
    },
    computed: {
      showGoods() {
        return this.goods[this.currentType].list
      }
    }

  }
</script>

<style scoped>
  #home {
    height: 100vh;
    position: relative;
  }
  .nav-bar {
    background-color: var(--color-tint);
    color: #fff;
    position: relative;
    top: 0;
    left: 0;
    right: 0;
  }
  .tab-control {
    position: relative;
    z-index: 9;
  }
  .content {
    position: absolute;
    top: 44px;
    bottom: 49px;
    left: 0;
    right: 0;
    overflow: hidden;
  }
</style>