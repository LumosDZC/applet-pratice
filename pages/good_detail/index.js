import { request } from "../../request/index"

Page({
  /**
 * 页面的初始数据
 */
  data: {
    //商品所要展示数据
    goodObj: {},
    isCollect: false, //是否收藏
  },
  //图片地址
  picUrl: [],
  //商品全部数据
  GoodInfo: {},

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // const {goods_id} = options;
    // console.log(goods_id);
    // this.getShopDetail(goods_id);
  },

  onShow() {
    //获取页面传来的参数
    let pages = getCurrentPages();
    let currentPage = pages[pages.length - 1];
    let options = currentPage.options;

    const { goods_id } = options;
    this.getShopDetail(goods_id);

  },

  //请求商品详情数据
  async getShopDetail(goods_id) {
    const res = await request({ url: '/goods/detail', data: { goods_id } });
    console.log(res);
    const goodObj = res.data.message;
    this.picUrl = goodObj.pics;
    this.GoodInfo = goodObj;

    //获取收藏数据
    let collect = wx.getStorageSync("collect") || [];
    //判断是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodInfo.goods_id);

    //优化，提取必要参数
    this.setData({
      goodObj: {
        goods_name: goodObj.goods_name,
        goods_price: goodObj.goods_price,
        goods_introduce: goodObj.goods_introduce.replace(/\.webp/g, ".jpg"),
        pics: goodObj.pics
      },
      isCollect
    });


  },

  //点击预览图片
  handlePreviewImg(e) {
    //当前图片
    const { index } = e.currentTarget.dataset;
    let picUrl = this.picUrl.map(v => v.pics_mid);
    console.log(e, picUrl);
    //预览图片
    wx.previewImage({
      current: picUrl[index],
      urls: picUrl,
    });
  },

  //点击，加入购物车
  handleCartAdd() {
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];
    //判断商品对象是否在购物车数据中
    let index = cart.findIndex(v => v.goods_id === this.GoodInfo.goods_id);
    if (index === -1) {
      //不存在 添加进去
      this.GoodInfo.num = 1;
      this.GoodInfo.checked = true;
      cart.push(this.GoodInfo);
    } else {
      //已存在数据执行num++
      cart[index].num++;
    };
    //存
    wx.setStorageSync("cart", cart);
    //弹窗提示
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true, //防止用户暴力点击
    });


  },

  //收藏功能
  handleCollect() {
    let isCollect = false;
    let collect = wx.getStorageSync("collect") || [];
    let index = collect.findIndex(v => v.goods_id === this.GoodInfo.goods_id);

    if (index !== -1) {
      //有收藏
      collect.splice(index, 1);
      isCollect = false;
      wx.showToast({
        title: '取消收藏',
        icon: 'success',
        mask: true
      });  
    } else {
      //无收藏
      collect.push(this.GoodInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      }); 
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    });
  }
})