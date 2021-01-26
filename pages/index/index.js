//引入发送请求的方法
import { request } from "../../request/index.js";

Page({
  data: {
    //轮播图数组
    swiperList: [],
    //分类数组
    cateList: [],
    //楼层数据
    floorList: []
  },
  onLoad: function (options) {
    this.getSwiperList();
    this.getCateList();
    this.getFloorList();
  },

  //获取轮播图数据
  getSwiperList() {
    //发送异步请求获取轮播图数据
    // wx.request({
    //   url: '/home/swiperdata',
    //   success: (result) => {
    //     console.log(result);
    //     this.setData({
    //       swiperList: result.data.message
    //     })
    //   },
    //   fail: (error) => {console.log(error)}
    // });
    request({ url: "/home/swiperdata" })
      .then(result => {
        console.log(result, '轮播图');
        this.setData({
          swiperList: result.data.message
        })
      })
  },

  //获取分类数据
  getCateList() {
    request({ url: "/home/catitems" })
      .then(result => {
        console.log(result, '分类');
        this.setData({
          cateList: result.data.message.reverse()
        })
      })
  },

  //获取分类数据
  getFloorList() {
    request({ url: "/home/floordata" })
      .then(result => {
        console.log(result, '楼层');
        let floorList = result.data.message;
        //处理数据，
        let len = floorList.length;
        for (let i = 0; i < len; i++) {
          let len2 = floorList[i].product_list.length;
          for (let k = 0; k < len2; k++) {
            let r = floorList[i].product_list[k].navigator_url.replace(/\/goods_list/g, '/good_list/index');
            floorList[i].product_list[k].navigator_url = r;
          }
        }
        console.log(floorList);
        this.setData({
          floorList
        })
      })
  }
});
