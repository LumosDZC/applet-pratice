import { getSetting, chooseAddress, openSetting, showModal, showToast, requestPayment } from "../../utils/util";
import { request } from "../../request/index";

Page({

  /**
   * 页面的初始数据
   */
  data: {
    address: {},
    //购物车数据
    cart: [], //此时已经（见onshow函数） 过滤好
    totalPrice: 0,  //总价格
    totalNum: 0, //总数量
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  // 生命周期函数--监听页面显示
  onShow() {
    //获取缓存中的地址
    const address = wx.getStorageSync("address");
    //获取缓存中的购物车数据
    let cart = wx.getStorageSync("cart") || [];

    //过滤后的购物车数据处理
    cart = cart.filter(v => v.checked);

    //总价格、总数量
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });

    //更新数据
    this.setData({
      cart,
      totalPrice,
      totalNum,
      address
    });
  },

  //点击支付
  async handleOrderPay() {
    try {
      // 判断token
      const token = wx.getStorageSync("token");

      if (!token) {
        //获取授权
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }

      //创建订单
      //头参数
      // const header = { Authorization: token };
      //请求体参数  价格先写个0.1,以防被扣钱，
      const order_price = this.data.totalPrice; //||0.1
      const consignee_addr = this.data.address.all;

      const cart = this.data.cart;
      let goods = [];

      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }));

      const orderParams = { order_price, consignee_addr, goods };
      //发送请求
      const res = await request({ url: '/my/orders/create', method: 'post', data: orderParams});
      console.log(res, '生成订单编号');
      const { order_number } = res.data.message;

      //支付接口
      const res1 = await request({ url: '/my/orders/req_unifiedorder', method: 'post',data: { order_number } });
      console.log(res1, '生成订单');
      const { pay } = res1.data.message;

      //发起微信支付,应该会不成功
      const res2 = await requestPayment(pay);
      console.log(res2, "支付情况");

      //查询后台 订单状况
      const res3 = await request({ url: '/my/orders/chkOrder', method: 'post', data: { order_number } });
      console.log(res3, '支付情况');

      await showToast({title:'支付成功'});

    } catch (err) {
      console.log(err);
      await showToast({title:'支付失败'});
    } finally {
      //以下都需放在try里，代表支付成功后的操作

      let newCart = wx.getStorageSync("cart");
      newCart = newCart.filter(v=>!v.checked);
      wx.setStorageSync("cart", newCart);

      // 考虑到这个支付不可能成功，所以无论怎样都让他跳到订单页面
      wx.navigateTo({
        url: '/pages/order/index',
      });
        
    }
  }

})