
let ajaxTimes = 0; //统计发送请求的次数

//发送请求的方法
export const request = (params) => {

    //判断url是否需要带有 /my/ 请求的是私有的路径 带上header token
    let header = {...params.header};
    if(params.url.includes('/my/')){
        //拼接header 加上token
        header["Authorization"] = wx.getStorageSync("token");
          
    }

    ajaxTimes++;
    wx.showLoading({
        title: '加载中',
        mask: true //加载蒙板
    })

    //定义公共的url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result);
            },
            fail: (err) => {
                reject(err);
            },
            complete: () => {
                ajaxTimes--;
                //最后一次才隐藏
                if(ajaxTimes === 0) wx.hideLoading();
            }
        });

    })
}