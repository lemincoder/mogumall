# hymall

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Run your tests
```
npm run test
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).

#Home页面思路
## 一.tabbar 底部导航栏

## 二.navbar 顶部

## 三.swiper 轮播图 

## 四.recomment

## 五.FeatureView

* 独立组件封装featureView
  * div>a>img

## 六.TabControl

* 独立组件的封装
  * props->titles
  * div>根据titles v-for遍历div -> span{{title}}
  * css相关
  * 选中哪一个tab,哪一个tab的文字颜色变色,下面border-bottom
    * currentIndex

## 七.首页商品数据的请求

### 7.1设计数据结构,用于保存数据

goods: {

pop: page/list

new: page/list

sell: page/list

}

### 7.2发送数据请求

* 在home.js中封装getHomeGoods(type,page)
* 在Home.vue中,又在methods中的getHomeGoods(type)
* 调用getHomeGoods('pop')/getHomeGoods('new')/getHomeGoods('sell')
  * page:动态获取对应的page
* 获取到数据:res
  * this.goods[type].list.push(...res.data.list)
  * this.goods[type].page += 1

goods: {

pop: page1/list

new: page1/list

sell: page1/list

}

## 八.对商品数据进行展示

### 8.1封装GoodsList.vue组件

* props:goods -> list[30]
* v-for goods -> GoodsListItem[30]
* GoodsListItem(组件) -> GoodsItem(数据)

### 8.2封装GoodsListItem.vue组件

* props: goodsItem
* goodsItem取出数据,并且使用正确的div/span/img基本标签进行展示

## 九.对滚动进行重构:Better-Scroll

### 9.1在index.html中使用Better-Scroll

* const bscroll = new BScroll(el, {})
* 注意: wrapper -> content ->很多内容
* 1.监听滚动
  * probeType:0/1/2(手指滚动)/3(只要是滚动)
  * bscroll.on('scroll',(position) => {})
* 2.上拉加载
  * pullUpLoad:true
  * bscroll.on('pullingUp',()=>{})
* 3.click:false
  * button可以监听点击
  * div不可以

### 9.2在Vue项目中使用Better-Scroll

* 对Better-Scroll进行封装:Scroll.vue
* Home.vue和Scroll.vue之间进行通信
  * Home.vue将probeType设置为3
  * Scroll.vue需要通过$emit,实时将事件发送到Home.vue

## 十.回到顶部BackTop

### 10.1对BackTop.vue组件的封装

### 10.2如何监听组件的点击

* 直接监听back-top的点击,需要加上.native
* 回到顶部
  * scroll对象,scroll.scrollTo(x,y,time)
  * this.$refs.scroll.scrollTo(0,0,500)

### 10.3BackTop组件的显示和隐藏

* isShowBackTop:false
* 监听滚动,拿到滚动的位置
  * -position.y > 1000 ->isShowBackTop:true
  * isShowBackTop =-position.y > 1000

## 十一.解决首页中Better-Scroll可滚动区域的问题

* Better-Scroll在决定有多少区域可以滚动时,是根据scrollerHeight属性决定的

  * scrollerHeight属性是根据放Better-Scroll的content中的自组建的高度
  * 但是我们的首页中,刚开始在计算scrollerHeight属性时,是没有将图片计算在内的
  * 所以,计算出来的高度是错误的
  * 后来图片加载进来之后有了新的高度,但是scrollerHeight属性并没有进行更新
  * 所以滚动出现了问题

* 如何解决这个问题

  * 监听每一张图片是否加载完成,只要有一张图片加载完成了,执行一次refresh()
  * 如何监听图片加载完成了?
    * 原生的js监听图片： img.onload = function() {}
    * Vue中监听： @load='方法'
  * 调用scroll的refres()

* 如何将GoodsListItem.vue中的事件传入到Home.vue中

  * 因为涉及到非父子组件的通信，所以这里我们选择了事件总线
    * bus->总线
    * Vue.prototype.$bus = new Vue()
    * this.$bus.$emit('事件名称',参数)
    * this.$bus.$on('事件名称',回调函数(参数))

* refresh找不到的问题

  * 第一：在Scroll中，调用this.scroll的方法之前，判断this.scroll对象是否有值
  * 第二：在mounted生命周期函数中使用this.$refs.scroll而不是created中

* 对于refresh非常频繁的问题，进行防抖操作

  * 防抖debounce/节流throttle

  * 防抖函数起作用的过程

    * 如果我们直接执行refresh，那么refresh函数会被执行30次

    * 可以将refresh函数传入到debounce函数中，生成一个新的函数

    * 而新生成的函数，并不会非常频繁的调用，如果下一次执行来的非常快，那么会将上一次取消掉

    * ```js
      debounce(func, delay) {
        let timer = null
        return function (...args) {
          if (timer) clearTimeout(timer)
          timer = setTimeout(() => {
            func.apply(this, args)
          }, delay)
        }
      }
      ```

## 十二.上拉加载更多

## 十三.tabControl的吸顶效果

### 13.1获取到tabControl的offsetTop

* 必须知道滚动到多少时，开始有吸顶效果，这个时候就需要获取tabControl的offsetTop
* 但是，如果直接在mounted中获取tabcontrol的offsetTop，那么值时不正确的
* 如何获取正确的值
  * 监听HomeSwiper中img的加载
  * 加载完成后，发出事件，在Home.vue中，获取正确的值
  * 补充
    * 为了不让HomeSwiper多次发出事件
    * 可以使用isLoad的变量进行状态的记录
  * 注意：这里不进行多次调用和debounce的区别

### 13.2监听滚动，动态的改变tabControl的样式

* 问题1：下面的商品内容会突然上移
* 问题2：tabControl虽然设置了fixed，但是也随着Better-Scroll一起滚出去了

解决

* 在最上面复制一份TabControl组件对象，利用它来实现停留功能

其他方案在解决停留问题

* 最上面，多复制一份PlaceHolderTabControl组件对象，利用他来实现停留功能
* 当用户滚动到一定位置时，PlaceHolderControl显示出来
* 当用户滚动没有达到一定位置时，PlaceHolderTabControl隐藏起来

## 十四.让Home保持原来的状态

### 14.1让Home不用随意销毁

* keep-alive

### 14.2让Home中的内容保持原来的位置

* 离开时，保存一个位置信息saveY
* 进来时，将位置设置为原来保存的位置saveY信息即可
  * 注意：最好回来时，进行一次refresh()

#Detail页面思路
## 一.点击商品进入详情页

## 二.解决-首页保持位置状态

```
deactivated：记录离开时的位置
```

```
activated：通过scrollTo函数，设置离开时位置
```

## 三.详情页的导航栏实现

* 返回按钮：left
* 标题列表的展示：center

## 四.请求详情的数据

* 接口：/detail?iid=

## 五.轮播图的实现

* Swiper/SwiperItem

## 六.商品基本信息的展示

* 数据来自四面八方
* 对数据进行汇总：一个对象当中
* 一个对象传入到子组件中

## 七.店铺信息的展示

## 八.商品图片的展示

## 九.参数信息的展示

## 十.评论信息的展示

* 事件格式化
* 服务器返回的时间戳 -> date ->格式化
* yyyy-MM-dd hh:mm:ss

## 十一.推荐数据的展示

* 请求推荐数据
* GoodsList展示

## 十二.mixin的使用

* 创建混入对象：const mixin ={}
* 组件对象中：mixins:[mixin]

## 十三.处理两个bug

* 首页的tabControl
* 详情滚动的bug

## 十四.标题和内容的联动效果

### 14.1点击标题，滚动到对应的追她

* zaidetail中监听标题的点击，获取index
* 滚动到对应的主题
  * 获取所有主题的offsetTop
    * 1.created肯定不行
    * 2.mounted也不行，数据还没有获取到
    * 3.获取到的数据的回调也不行，DOM还没有渲染完
    * 4.$nextTick也不行，因为图片的高度还没有被计算在内
    * 5.土拍你加载完成后，获取到的高度才是正确的

### 14.2内容滚动，显示正确的标题

```vue
let length = this.themeTopYs.length
for (let i = 0; i < length-1; i++) {
  if (this.currentIndex !== i && (positionY >= this.themeTopYs[i]) && (positionY < this.themeTopYs[i+1])) {
    this.currentIndex = i
    this.$refs.nav.currentIndex = this.currentIndex
  }
}
```

## 十五.底部工具栏的封装

## 十六.详情页的回到顶部

## 十七.点击加入购物车

### 17.1监听加入购物车按钮的点击，并且获取商品信息

* 监听
* 获取商品信息：iid/price/image/title/desc

### 17.2将商品添加到Vuex中

* 安装Vuex
* 配置Vuex
* 定义mutations，将商品添加到state.cartList
* 重构代码：
  * 将mutations中的代码抽取到actions中(定义两个mutations)
  * 将mutations/actions单独抽取到文件中
#Cart页面思路
## 一.购物车的展示

### 1.1购物车的导航栏的展示

### 1.2购物车商品的展示

* cartList -> Scroll(滚动问题)
* cartListItem -> CheckButton

### 1.3商品的选中和不选中切换

* 修改模型对象，改变选中和不选中

### 1.4底部工具栏的汇总

* 全选按钮
* 计算总价格
* 去计算

## 二.购物车的全选按钮

* 判断是否全选
* 点击全选按钮
  * 如果原来都是选中，点击一次，全部不选中
  * 如果原来都是不选中，全部选中

## 三.Vuex的补充

### 3.1Vuex的补充

* Actions可以返回一个Promise
* mapActions的映射关系

### 3.2Toast封装
