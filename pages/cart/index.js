// pages/cart/index.js
import { getSetting, chooseAddress, openSetting, showModal, showToast } from "../../utils/util"

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    //购物车数据
    cart: [],
    //全选的状态
    allChecked: false,
    totalPrice: 0,  //总价格
    totalNum: 0, //总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  onShow() {
    //获取缓存中的地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    const cart = wx.getStorageSync("cart") || [];

    this.setCart(cart);
    this.setData({
      address,
    });
  },

  //获取收货地址
  async handleChooseAddress() {
    try {
      const res1 = await getSetting();
      const scopeAddress = res1.authSetting["scope.address"];
      if (scopeAddress === false) {
        await openSetting();
      }
      const address = await chooseAddress();
      //存入缓存
      console.log(address);
      address.all = address.provinceName + address.cityName + address.countyName + address.detailInfo;
      wx.setStorageSync("address", address);

    } catch (err) {
      console.log(err);
    }

    /*     //调用地址api
        wx.chooseAddress({
          success: (result) => {
            console.log(result);
          },
        }); */
    //获取 用户 对小程序 所授予 获取地址的 权限 状态 scope
    //地址确定--true  地址取消--false  从未调用--undefined
    //现在不需这样做了，直接上面代码即可
    /*    wx.getSetting({
         success: (result) => {
           const scopeAddress = result.authSetting["scope.address"];
           //同意授权
           if(scopeAddress===true || scopeAddress === undefined){
             wx.chooseAddress({
               success: (res1) => {
                 console.log(res1);
               },
             });
           }
           //拒绝授权
           else {
             //打开权限设置
             wx.openSetting({
               success: (res2) => {
                 wx.chooseAddress({
                   success: (res3) => {
                     console.log(res3);
                   },
                 });
               },
             });
           }
         },
       }); */


  },

  //商品选中
  handleItemChange(e) {
    //获取需修改的商品id
    const goods_id = e.currentTarget.dataset.id;
    console.log(goods_id);
    //获取购物车数据
    let { cart } = this.data;
    //找到需修改的商品对象
    let index = cart.findIndex(v => v.goods_id === goods_id);
    //状态取反
    cart[index].checked = !cart[index].checked;

    this.setCart(cart);
  },

  //设置购物车状态同时 重新计算 底部工具栏数据 全选 总价格、数量 
  setCart(cart) {

    /* 
    //every 遍历数组 接受回调函数 全部返回true才返回true
    //注意： 空数组调用every会返回true
    const allChecked = cart.length?cart.every(v=>v.checked):false;
     */

    let allChecked = true;
    //总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num;
      } else {
        allChecked = false;
      }
    });
    //判断cart是否为空数组
    allChecked = cart.length != 0 ? allChecked : false;

    //更新数据
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    });
    wx.setStorageSync("cart", cart);
  },

  //全选功能
  handleItemAllCheck() {
    let { cart, allChecked } = this.data;
    //修改
    allChecked = !allChecked;
    cart.forEach(v => {
      v.checked = allChecked;
    });

    this.setCart(cart);
  },

  //商品数量的增减
  async handleItemNumEdit(e) {
    let { status, id } = e.currentTarget.dataset;
    console.log(status, id);

    let { cart } = this.data;
    //找到要修改的商品索引
    const index = cart.findIndex(v => v.goods_id === id);

    // 判断是否要删除
    if (cart[index].num <= 1 && status === -1) {
      //弹框提示
      const res = await showModal({ content: '您是否要删除' });
      if (res.confirm) {
        //删除
        cart.splice(index, 1);
        this.setCart(cart);
        return;
      }
    }
    //增减数量
    cart[index].num += parseInt(status);
    if (cart[index].num >= cart[index].goods_number) cart[index].num = cart[index].goods_number;
    if (cart[index].num <= 0) cart[index].num = 0;
    this.setCart(cart);
  },

  //结算功能
  handlePay(){
    const {address, totalNum} = this.data;
    //判断收货地址
    if(!address.userName){
      showToast({title:'您还没有选择收货地址！'});
      return ;
    };

    //判断商品数量
    if(totalNum === 0){
      showToast({title: '您还没选择商品！'});
      return ;
    };

    //跳到支付页面
    wx.navigateTo({
      url: '/pages/pay/index',
    });
      
  }

})