// pages/search/index.js
import { request } from '../../request/index';
import { debounce } from "../../utils/util";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    //搜索内容
    inputValue: '',
    //搜索出的商品
    goods: [],
    isFocus: false, //按钮是否隐藏
  },

  //输入框的值改变 触发的函数
  handleInput(e) {
    // console.log(this.data.inputValue,'双向数据绑定');
    // console.log(e.detail.value,'传参');
    const { inputValue } = this.data;
    //检验是否合法
    if (!inputValue.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    this.debounceSearch(inputValue);
    this.setData({
      isFocus: true
    })
  },

  //延迟搜索
  debounceSearch: debounce(function (inputValue) { 
    this.getSearch(inputValue);
  }, 1500),
  

  //发送请求获取搜索数据
  async getSearch(query) {
    const res = await request({ url: '/goods/qsearch', data: { query } });
    console.log(res);
    const goods = res.data.message;
    this.setData({
      goods
    });
  },

  //取消按钮点击
  handleCancel(){
    this.setData({
      inputValue: '',
      isFocus: false,
      goods: []
    })
  }

})