// pages/user/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {},
    collectNum: 0,
  },

  onShow(){
    this.getUserInfo();
  },

  //用户登录
  handleGetUserInfo(e){
    // console.log(e);

    //获取用户信息
    const {userInfo} = e.detail;
    //存用户信息
    wx.setStorageSync("userInfo", userInfo);

    this.setData({
      userInfo
    })
  },

  //取出用户数据
  getUserInfo(){
    const userInfo = wx.getStorageSync("userInfo");
    const collect = wx.getStorageSync("collect")||[];
    
    // console.log(userInfo,"--用户信息");
    this.setData({
      userInfo,
      collectNum: collect.length
    });
  }

})