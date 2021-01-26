// pages/collect/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
     //导航栏
     tabs: [
      {
        id: 0,
        value: '商品收藏',
        isActive: true,
      },
      {
        id: 1,
        value: '品牌收藏',
        isActive: false,
      },
      {
        id: 2,
        value: '店铺收藏',
        isActive: false,
      },
      {
        id: 3,
        value: '浏览足迹',
        isActive: false,
      },
    ],
    //收藏的数据
    collect:[],
    //选择的类型索引
    typeIndex: 0,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow(){
    const collect = wx.getStorageSync("collect");
    this.setData({
      collect
    });
  },

  //切换面板
  handleChangeItem(e){
    const {index} = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i)=>{
      v.isActive = false;
    });
    tabs[index].isActive = true;
    this.setData({
      tabs
    })
  },

  //切换类型索引
  handleChangeType(e){
    const {index} = e.currentTarget.dataset;
    this.setData({
      typeIndex: index
    });
  }
})