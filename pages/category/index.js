// pages/category/index.js
import { request } from "../../request/index"
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //左侧导航栏汇总
    leftMenuList: [],
    //右侧区域
    rightArea: [],
    //现在所处的左侧导航
    currentIndex: 0,
    //右边据顶部的距离
    scrollTop: 0,
  },
  //接口返回的数据（页面全局参数，方便使用）
  Cates: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 判断本地存储有无旧数据
    // 无则发送请求
    const Cates = wx.getStorageSync('cates');
    if (!Cates) {
      //不存在
      this.getCates();
    } else {
      // 有无过期
      if (Date.now() - Cates.time > 1000 * 10) {
        this.getCates()
      } else {
        console.log("用旧数据");
        this.Cates = Cates.data;
        //左侧
        let leftMenuList = this.Cates.map(v => v.cat_name);
        //右侧
        let rightArea = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightArea
        })
      }
    }
  },

  //获取分类数据
  async getCates() {
    // request({
    //   url: "/categories"
    // }).then(res => {
    //   console.log(res);
    //   this.Cates = res.data.message;
    //   //本地存
    //   wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //   //左侧
    //   let leftMenuList = this.Cates.map(v => v.cat_name);
    //   //右侧
    //   let rightArea = this.Cates[0].children;
    //   this.setData({
    //     leftMenuList,
    //     rightArea
    //   })

    // }).catch(err => {
    //   console.log(err);
    // })
    const res = await request({ url: "/categories" });
    console.log(res);
    this.Cates = res.data.message;
    //本地存
    wx.setStorageSync("cates", { time: Date.now(), data: this.Cates });

    //左侧
    let leftMenuList = this.Cates.map(v => v.cat_name);
    //右侧
    let rightArea = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightArea
    })
  },

  //点击左侧特定行
  handleItemTap(e) {
    console.log(e);
    // 获取被点击的标题的索引
    const { index } = e.currentTarget.dataset;

    //展示特定区域
    let rightArea = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightArea,
      //滑倒顶部
      scrollTop: 0
    })
  }
})