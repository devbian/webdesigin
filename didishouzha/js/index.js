//(function () {
var CURRENT_PAGE = 0;
var USER_DATA = JSON.parse(getUrlParam('data')) || {};

function isEmpty(val) {
	if (!val) {
		return true;
	}
	if (!isNaN(val) && val <= 0) {
		return true;
	}
	return val == '-';
}
if (isEmpty(USER_DATA.totalDistance)) {
	USER_DATA.totalDistance = 10;
} else {
	USER_DATA.totalDistance = Math.ceil(USER_DATA.totalDistance);
}
if (isEmpty(USER_DATA.succOrderNum)) {
	USER_DATA.succOrderNum = 1;
}
if (isEmpty(USER_DATA.mostDriverName)) {
	USER_DATA.mostDriverName = '滴滴出行';
}
if (isEmpty(USER_DATA.mostDriverNum)) {
	USER_DATA.mostDriverNum = 1;
}
if (isEmpty(USER_DATA.totalWaitTime)) {
	USER_DATA.totalWaitTime = 30;
} else {
	USER_DATA.totalWaitTime = Math.ceil(USER_DATA.totalWaitTime);
}
if (isEmpty(USER_DATA.mostCreateTimePeriod)) {
	USER_DATA.mostCreateTimePeriod = "19";
}
if (isEmpty(USER_DATA.couponAmount)) {
	USER_DATA.couponAmount = 10;
} else {
	USER_DATA.couponAmount = Math.ceil(USER_DATA.couponAmount);
}

document.getElementById('mostDriverName').innerText = (USER_DATA.mostDriverName || '滴滴出行')
		+ '师傅';
USER_DATA.mostCreateTimePeriod = Number(USER_DATA.mostCreateTimePeriod || 0);
var timeType = timeType(USER_DATA.mostCreateTimePeriod);
if (timeType == 1) {
	var mostMorning = document.getElementById('mostMorning');
	mostMorning.className = mostMorning.className.replace('page-filter', '');
} else if (timeType == 2) {
	var mostAM = document.getElementById('mostAM');
	mostAM.className = mostAM.className.replace('page-filter', '');
} else if (timeType == 3) {
	var mostPM = document.getElementById('mostPM');
	mostPM.className = mostPM.className.replace('page-filter', '');
} else {
	var mostNight = document.getElementById('mostNight');
	mostNight.className = mostNight.className.replace('page-filter', '');
}

window.addEventListener('DOMContentLoaded', function() {
	common.loadingCount(document.querySelector('#loading i'), function() {
		dom.page.style.visibility = 'visible';
		dom.arrow.style.display = 'block';
		dom.music.style.display = 'block';
		dom.music.addEventListener('click', function() {
			if (dom.player.paused) {
				dom.player.play();
				dom.music.classList.remove('paused');
			} else {
				dom.player.pause();
				dom.music.classList.add('paused');
			}

		}, false);

		var share_param = getUrlParam('showGift');
		if (share_param == 1) {
			document.getElementById('shareBtn').style.display = 'block';
		} else {
			document.getElementById('shareBtn2').style.display = 'block';
		}

		boxCancelCallback();
	});

}, false);

// alert(8);

function timeType(val) {
	if (val >= 4 && val <= 8) {
		return 1;
	} else if (val >= 9 && val <= 12) {
		return 2;
	} else if (val >= 13 && val <= 18) {
		return 3;
	} else {
		return 0;
	}
}

/* 所有页面dom */
var dom = {
	page : document.getElementById('page'),
	arrow : document.getElementById('arrow'),
	music : document.getElementById('music'),
	player : document.getElementById('player'),
	text : document.getElementById('text'),
	road : document.getElementById('road'),
	road_number : document.getElementById('road_number'),
	gift_number : document.getElementById('gift_number'),
	wait_number : document.getElementById('wait_number'),
	walk_number : document.getElementById('walk_number'),
	meet_number : document.getElementById('meet_number'),
	mask : document.getElementById('mask'),
	box : document.getElementById('box'),
	btn : document.getElementById('name_btn'),
	input : document.getElementById('name_input'),
	name : document.getElementById('name'),
	silk : document.getElementById('silk'),
	busy_am : document.getElementById('busy_am'),
	busy_pm : document.getElementById('busy_pm'),
	meet : document.getElementById('meet'),
	morning : document.getElementById('morning'),
	gift : document.getElementById('gift'),
	light : document.getElementById('light')
};

/*
 * 首页动画效果
 * 
 * 
 */
// (function () {
/* 阻止浏览器touchmove的默认行为 */
document.addEventListener('touchmove', function(e) {
	e.preventDefault();
}, false);

/* 输入框消失的回调函数 */
function boxCancelCallback(value) {
	// dom.name.innerHTML = value.split('').join('<br/>');
	everyPage.showIndexAni();

	new common.touchPage({
		afterTouch : function(tpage) {
			CURRENT_PAGE = tpage.s_index;
			var prev_animation = tpage.prev_page.dataset.animation;
			var current_animation = tpage.current_page.dataset.animation;

			if (everyPage['hide' + prev_animation])
				everyPage['hide' + prev_animation]();

			// console.log(tpage.current_page);
			if (everyPage['show' + current_animation])
				everyPage['show' + current_animation]();
			console.log(tpage.s_index)
			if (tpage.s_index === 7) {
				dom.arrow.style.display = 'none';
			} else {
				dom.arrow.style.display = 'block';
			}
		}
	});
}

window
		.addEventListener(
				'load',
				function() {
					var imgs = [], imgs_light = [], imgs_meet = [], imgs_morning = [], imgs_busy_am = [], imgs_gift = [], imgs_foot_silk = [];
					for ( var i = 1; i <= 3; i++) {
						imgs_light.push('images/road_light_' + i + '.png');
					}
					/*
					 * for ( var i = 1; i <= 7; i++) {
					 * imgs_meet.push('images/meet_' + i + '.png'); }
					 */
					for ( var i = 1; i <= 2; i++) {
						imgs_morning.push('images/morning_' + i + '.png');
					}
					for ( var i = 1; i <= 3; i++) {
						imgs_busy_am.push('images/busy_am_' + i + '.png');
					}
					/*
					 * for ( var i = 1; i <= 9; i++) {
					 * imgs_gift.push('images/gift_' + i + '.png'); }
					 */
					/*
					 * for ( var i = 1; i <= 5; i++) {
					 * imgs_foot_silk.push('images/foot_silk_' + i + '.png'); }
					 */
					common.lazyImg(imgs.concat(imgs_light, imgs_meet,
							imgs_morning, imgs_busy_am, imgs_gift,
							imgs_foot_silk));
				}, false);
// })();

/*
 * 各个页面的动画
 * 
 */
var everyPage = {
	showIndexAni : function() {
		dom.text.style.display = 'block';
		dom.road.style.display = 'block';
		dom.mask.style.display = 'block';
	},
	showFootSilk : function() {
		this.silk_interval_1 = common.changeFrame(dom.silk, 'silk', 200, 5);
	},
	hideFootSilk : function() {
		this.silk_interval_1.stop();
	},
	showGift : function() {
		this.gift_interval_1 = common.numberCount(dom.gift_number);
		this.gift_interval_2 = common.changeFrame(dom.gift, 'gift', 200, 9,
				true);

		// console.log(this.gift_interval_1);
	},
	hideGift : function() {
		clearInterval(this.gift_interval_1);
		this.gift_interval_1 = null;
		dom.gift_number.innerText = '';
		this.gift_interval_2.stop();
	},
	showWalk : function() {
		this.walk_interval_1 = common.numberCount(dom.walk_number);
	},
	hideWalk : function() {
		clearInterval(this.walk_interval_1);
		this.walk_interval_1 = null;
		dom.walk_number.innerText = '';
	},
	showMeet : function() {
		this.meet_interval_1 = common.numberCount(dom.meet_number);
		this.meet_interval_2 = common.changeFrame(dom.meet, 'meet', 300, 7);
	},
	hideMeet : function() {
		clearInterval(this.meet_interval_1);
		this.meet_interval_1 = null;
		dom.meet_number.innerText = '';
		this.meet_interval_2.stop();
	},
	showBusyAm : function() {
		this.busy_am_interval_1 = common.changeFrame(dom.busy_am, 'busy-am',
				600, 3);
	},
	hideBusyAm : function() {
		this.busy_am_interval_1.stop();
	},
	showBusyPm : function() {
		this.busy_pm_interval_1 = common.changeFrame(dom.busy_pm, 'busy-pm',
				600, 3);
	},
	hideBusyPm : function() {
		this.busy_pm_interval_1.stop();
	},
	showWait : function() {
		this.wait_interval_1 = common.numberCount(dom.wait_number);
	},
	hideWait : function() {
		clearInterval(this.wait_interval_1);
		this.wait_interval_1 = null;
		dom.wait_number.innerText = '';
	},
	showMorning : function() {
		this.morning_interval_1 = common.changeFrame(dom.morning, 'morning',
				600, 2);
	},
	hideMorning : function() {
		this.morning_interval_1.stop();
	},
	showLight : function() {
		this.light_interval_1 = common.changeFrame(dom.light, 'light', 200, 3);
		this.light_interval_2 = common.numberCount(dom.road_number);
	},
	hideLight : function() {
		this.light_interval_1.stop();
		clearInterval(this.light_interval_2);
		this.light_interval_2 = null;
		dom.road_number.innerText = '';
	}
};



var SHARE_CONTENTS = [
		[ '这一年，这一路，2015再见，2016出发。' ],
		[
				'2015年我打车的路加起来有' + getMountainCount(USER_DATA.totalDistance)
						+ '个珠穆朗玛峰那么高！',
				USER_DATA.totalDistance + 'km的打车历程，让我对这陌生的城市日渐熟悉' ],
		[ '过去一年里打车' + USER_DATA.succOrderNum + '次！我是最强打车王！',
				'来头不小！2015年我暴打车' + USER_DATA.succOrderNum + '次。',
				'2015年我打车' + USER_DATA.succOrderNum + '次，见过2点的月亮和3点的太阳。' ],
		[
				'茫茫人海中，' + USER_DATA.mostDriverNum + '次遇见，谢谢'
						+ USER_DATA.mostDriverName + '师傅。',
				'我的年度有缘人，竟然是那个送Ta回家的' + USER_DATA.mostDriverName + '师傅。',
				USER_DATA.mostDriverName + '师傅，谢谢您，那' + USER_DATA.mostDriverNum
						+ '次巧合我都记得。' ],
		[
				'2015年最大牌的竟然是我！让人等了' + minuteToHour(USER_DATA.totalWaitTime)
						+ '小时！',
				'颜值高才有资格被他耐心地等' + minuteToHour(USER_DATA.totalWaitTime) + '小时~',
				'忘了刮风或下雨，他在那里等了我' + minuteToHour(USER_DATA.totalWaitTime)
						+ '小时。' ],
		[ '晚上' + USER_DATA.mostCreateTimePeriod + '点，总是太阳沉了路灯亮着我才在归家的路上。',
				'早上' + USER_DATA.mostCreateTimePeriod + '点，我总能见到路上最好的晨曦。',
				'上午' + USER_DATA.mostCreateTimePeriod + '点，最忙的时间里，总有最充实的我。',
				'下午' + USER_DATA.mostCreateTimePeriod + '点，最忙的时间里，总有最充实的我。' ],

		[ '边打车边理财，一年从滴滴赚走' + USER_DATA.couponAmount + '元！',
				'他不认识我，却给我花了' + USER_DATA.couponAmount + '元。' ] ];

function getMountainCount(val) {
	val = val || 0;
	val = Number(val);
	if (val <= 4) {
		return '半';
	} else {
		return Math.ceil(val / 8);
	}
}

function minuteToHour(val) {
	val = val || 0;
	val = Number(val);
	val = Math.ceil(val / 60);
	if (val < 1) {
		val = 1;
	}
	return val;
}

function getShareContent() {
	var array = SHARE_CONTENTS[CURRENT_PAGE];
	if (!array) {
		array = SHARE_CONTENTS[0];
	}
	if (CURRENT_PAGE == 5) {
		return array[timeType];
	}
	var length = array.length;
	if (length == 1) {
		return array[0];
	}
	var seed = Math.ceil(length * 10 * Math.random()) % length;
	return array[seed];
}

function getShareIcon() {
	var prefix = CURRENT_PAGE;
	if (CURRENT_PAGE == 5) {
		prefix = '' + prefix + '-' + timeType;
	}
	if (CURRENT_PAGE > 6) {
		prefix = 0;
	}
	var root = location.href;
	var index = location.href.indexOf('index.html');
	root = root.substring(0, index) + 'images/wxshare/';
	var result = root + prefix + '.jpg';
	return result;
}

function getGift() {
	var phone = USER_DATA.phone;
	location.href = 'http://gsactivity.diditaxi.com.cn/gulfstream/activity/v2/giftpackage/index?g_channel=e08e2aa8ae2b787e0be09d00222917eb&phone='
			+ phone;
}

function getGift2() {
	alert('怎么分享你懂的');
}
// })();
