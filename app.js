//app.js
App({
    //onLaunch,onShow: options(path,query,scene,shareTicket,referrerInfo(appId,extraData))
    onLaunch: function (options) {

    },
    onShow: function (options) {
        //去除打印
        console.log = () => { };
    },
    onHide: function () {

    },
    onError: function (msg) {

    },
    //options(path,query,isEntryPage)
    onPageNotFound: function (options) {

    }
});
