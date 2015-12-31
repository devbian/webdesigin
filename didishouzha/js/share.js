!function () {
    var shareData = {
        share_url: "http://report2015.xiaojukeji.com/report.html",
        share_img_url: "",
        share_icon_url: "http://member.xiaojukeji.com/web-member/views/upgrade/images/shareLogo/shareLogo_180.jpg",
        share_title: "你不记得的，滴滴都记得。"        
    };
    if(getUrlParam('showGift') == 1){
		shareData.share_url = shareData.share_url + '?showGift=1';
	}
    /* 用于[微信]环境分享 */
    document.addEventListener("WeixinJSBridgeReady", function () {
    	document.getElementById('player').play();
    	
        WeixinJSBridge.call("showOptionMenu"), WeixinJSBridge.call("hideToolbar");

        WeixinJSBridge.on("menu:share:appmessage", function () {
        	var desc = getShareContent();
            WeixinJSBridge.invoke("sendAppMessage", {               
                img_url: getShareIcon(),
                img_width: "",
                img_height: "",
                link: shareData.share_url,
                title: shareData.share_title,
                desc: desc
              
            }, function (e) {
                
                
            });
        });
        WeixinJSBridge.on("menu:share:timeline", function () {
        	var desc = getShareContent();
            WeixinJSBridge.invoke("shareTimeline", {
                img_url: getShareIcon(),
                img_width: "",
                img_height: "",
                link: shareData.share_url,
                title: desc,
                desc: desc
                
            }, function (e) {
            	
            })
        });
    });

   
}();

function getUrlParam(name) {
	var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)"); // 构造一个含有目标参数的正则表达式对象
	var r = window.location.search.substr(1).match(reg); // 匹配目标参数
	if (r != null)
		return decodeURI(r[2]);
	return null; // 返回参数值
}