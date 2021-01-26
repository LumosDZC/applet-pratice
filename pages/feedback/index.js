// pages/feedback/index.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    //导航栏
    tabs: [
      {
        id: 0,
        value: '体验问题',
        isActive: true,
      },
      {
        id: 1,
        value: '商品、商家投诉',
        isActive: false,
      }
    ],
    //被选中的图片地址数组
    chooseImgs: [],
    //文本域内容
    textVal: ''
  },

  //外网图片路径
  UpLoadImgs: [],

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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

  //选择图片
  handleChooseImg() {
    wx.chooseImage({
      //同时选的图片数量
      count: 9,
      //图片格式 原图 压缩
      sizeType: ['original', 'compressed'],
      //图片来源 相册 照相机
      sourceType: ['album', 'camera'],
      success: (result) => {
        console.log(result);
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
  },

  //删除图片
  handleRemoveImg(e) {
    console.log(e);
    //获取子组件传来的值
    const src = e.detail;

    let { chooseImgs } = this.data;
    const index = chooseImgs.findIndex(v => v === src);
    //删除
    chooseImgs.splice(index, 1);
    this.setData({
      chooseImgs
    })
  },

  //文本域输入事件
  handleTextInput(e) {
    this.setData({
      textVal: e.detail.value
    })
  },

  //表单提交
  handleFormSubmit() {
    const { textVal, chooseImgs } = this.data;

    if (!textVal.trim()) {
      //不合法
      wx.showToast({
        title: '输入不合法',
        icon: 'none',
        image: '',
        mask: true,
      });
      return;
    }

    wx.showLoading({
      title: '正在上传中',
      mask: true,
    });

    //提交文本和图片
    if (chooseImgs.length != 0) {
      chooseImgs.forEach((v, i) => {
        // 上传图片
        wx.uploadFile({
          //图片上传到哪里
          url: 'https://img.coolcr.cn/api/upload',
          //上传的文件的路径
          filePath: v,
          //上传的文件名称
          name: "image",
          //顺带的文本信息
          formData: {},
          success: (result) => {
            console.log(result);
            let res = JSON.parse(result.data);
            //获取外网地址
            let { url } = res.data;
            this.UpLoadImgs.push(url);

            //所有图片上传完毕后
            if (i === chooseImgs.length - 1) {
              wx.hideLoading();

              //准备把文本域和图片提交给后台
              //先清空数据
              this.setData({
                textVal: '',
                chooseImgs: []
              });
              //返回上一个页面
              wx.navigateBack({
                delta: 1
              });
            }
          },
          fail: (err) => {
            console.log(err);
            wx.hideLoading();
            wx.showToast({
              title: '上传失败',
              icon: 'none'
            });
          }
        });
      });
    } else {
      //只提交文本
      wx.hideLoading();
        
      wx.navigateBack({
        delta: 1
      });
    }

  }
})