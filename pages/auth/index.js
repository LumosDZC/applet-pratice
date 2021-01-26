// pages/auth/index.js
import { login } from '../../utils/util';
import { request } from '../../request/index';

Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  //获取用户信息
  async handleGetUserInfo(e) {
    try {
      //获取用户信息
      const { rawData, signature, encryptedData, iv } = e.detail;
      //获取小程序登陆成功后的code
      const { code } = await login();

      //接口所需参数
      const loginParams = { rawData, signature, encryptedData, iv, code };

      //请求后得到的参数
      const res = await request({ url: '/users/wxlogin', data: loginParams, method: 'post' });

      console.log(res); //data.message里为null，因为这一步是需要企业账号的

      if (res.data.message) {
        const { token } = res.data.message;
        wx.setStorageSync("token", token);
      }
      // 教程里的token
      else {
        const token = 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo';
        wx.setStorageSync("token", token);
      }
      // wx.setStorageSync("token", '1234545gjsgjjf');
        
      //返回上一层，数字代表几层
      wx.navigateBack({
        delta: 1
      });
    } catch (err){
      console.log(err);
    }


  }
})

  