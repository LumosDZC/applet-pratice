const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return `${[year, month, day].map(formatNumber).join('/')} ${[hour, minute, second].map(formatNumber).join(':')}`
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : `0${n}`
};

/* promise形式 getSetting */
const getSetting = () => {
  return new Promise((resolve, reject) => {
    wx.getSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  })
};

/* promise形式 chooseAddress */
const chooseAddress = () => {
  return new Promise((resolve, reject) => {
    wx.chooseAddress({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  })
};

/*  promise形式 openSetting */
const openSetting = () => {
  return new Promise((resolve, reject) => {
    wx.openSetting({
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      },
    });
  })
};

// promise形式 showModal
const showModal = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      showCancel: true,
      cancelText: '取消',
      cancelColor: '#000000',
      confirmText: '确定',
      confirmColor: '#3CC51F',
      success: (result) => {
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
  })
};

//promise 形式 showToast
const showToast = ({title})=>{
  return new Promise((resolve,reject)=>{
    wx.showToast({
      title: title,
      icon: 'none',
      mask: false,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
      
  })
};

//Promise 形式 login
const login = ()=>{
  return new Promise((resolve,reject)=>{
    wx.login({
      timeout:10000,
      success: (result)=>{
        resolve(result);
      },
      fail:(err)=>{
        reject(err);
      }
    });
  })
};

//promise 形式 requestPayment
// @param {object} pay 支付所需要的参数

const requestPayment = (pay)=>{
  return new Promise((resolve,reject)=>{
    wx.requestPayment({
      ...pay,
      success: (result)=>{
        resolve(result);
      },
      fail: (err)=>{
        reject(err);
      }
    });
  })
};

//防抖,fn为函数
function debounce(fn,wait){
  let timeId = null;
  var delay = wait || 200;
  return function(){
    var args = arguments;
    var that = this;
    if(timeId !== null) clearTimeout(timeId);
    timeId = setTimeout(function(){
      fn.apply(that,args);
    },delay);
  }
}


module.exports = {
  formatTime,
  getSetting,
  chooseAddress,
  openSetting,
  showModal,
  showToast,
  login,
  requestPayment,
  debounce,
}