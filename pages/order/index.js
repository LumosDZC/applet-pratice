// pages/order/index.js
import {request} from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //订单
    orders: [],
    //导航栏
    tabs: [
      {
        id: 0,
        value: '全部',
        isActive: true,
      },
      {
        id: 1,
        value: '待付款',
        isActive: false,
      },
      {
        id: 2,
        value: '待发货',
        isActive: false,
      },
      {
        id: 3,
        value: '退款退货',
        isActive: false,
      },
    ],
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // options只存在onLoad
    console.log()
  },

  onShow(options){
    const token = wx.getStorageSync("token");
    if(!token){
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return ;
    }
      

    //获取当前的小程序页面栈-数组 长度最大是10页面
    let pages = getCurrentPages();
    //数组中 索引最大的页面就是当前页面
    let currentPage = pages[pages.length - 1];
    console.log(currentPage.options);
    //获取url上的type参数
    const {type} = currentPage.options;
    //激活选中页面标题 
    this.changeTitleByIndex(type - 1);
    this.getOrders(type);
  },

  //获取订单列表
  async getOrders(type){
    const res = await request({url:'/my/orders/all',data:{type}});
    // console.log(res);
    const {orders} = res.data.message;

    this.setData({
      //转换为正确日期格式
      orders:orders.map(v=>({...v,create_time_cn:(new Date(v.create_time*1000).toLocaleString())}))
    });
  },

  handleTabsItemChange(e) {
    // console.log(e);
    //得到索引
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    //发送请求
    this.getOrders(index+1);

  },

  //根据标题索引来激活选中 标题数组
  changeTitleByIndex(index){
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? v.isActive = true : v.isActive = false;
    });
    this.setData({
      tabs
    });
  }
})