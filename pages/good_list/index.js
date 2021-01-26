// pages/good_list/index.js
import { request } from "../../request/index";

Page({


  /**
   * 页面的初始数据
   */
  data: {
    //导航栏
    tabs: [
      {
        id: 0,
        value: '综合',
        isActive: true,
      },
      {
        id: 1,
        value: '销量',
        isActive: false,
      },
      {
        id: 2,
        value: '价格',
        isActive: false,
      },
    ],
    ///商品列表数据
    goodList: [],
  },
  //接口要的参数
  QueryParams: {
    query: "",
    cid: "",
    pagenum: 1,
    pagesize: 10
  },
  //总页数
  totalPages: 1,


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options);
    this.QueryParams.cid = options.cid || '';
    this.QueryParams.query = options.query || '';
    this.getGoodList();
  },

  // 页面触底函数，加载下一页数据
  onReachBottom() {
    /* 
    判断有无下一页
    总页数=总条数/页容量
    */
    if(this.QueryParams.pagenum >= this.totalPages){
      //无下一页,微信提示框

      wx.showToast({
        title: '已无数据^_^',
        icon: 'none',
      });       
    } else {
      //请求下一页数据
      this.QueryParams.pagenum++;
      this.getGoodList();
    }
  },

  //页面下拉刷新
  onPullDownRefresh(){
    //重置商品数组
    this.setData({
      goodList: []
    });
    //重置页码
    this.QueryParams.pagenum = 1;
    this.getGoodList();
  },


  //请求页面数据
  async getGoodList() {
    const res = await request({ url: "/goods/search", data: this.QueryParams });
    console.log(res);
    const { goods, total } = res.data.message;
    this.totalPages = Math.ceil(total / this.QueryParams.pagesize);
    console.log(this.totalPages);
    this.setData({
      goodList: [...this.data.goodList,...goods]
    });

    //手动关闭下拉刷新的窗口
    wx.stopPullDownRefresh();
  },

  //标题点击事件，从子组件传来的
  handleTabsItemChange(e) {
    // console.log(e);
    //得到索引
    const { index } = e.detail;
    let { tabs } = this.data;
    tabs.forEach((v, i) => {
      i === index ? v.isActive = true : v.isActive = false;
    });
    this.setData({
      tabs
    });
  },

})