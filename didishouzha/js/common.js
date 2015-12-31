(function () {
    window.common = {};

    /**
     * 初始化rem
     * @param page_width 页面最大宽度 common.initPage(640)
     */
    common.initPage = function (page_width) {
        window.addEventListener('DOMContentLoaded', function () {
            page_width = page_width ? page_width : 750;
            document.getElementsByClassName('page')[0].style.maxWidth = page_width + 'px';
            var _self = {};
            _self.width = page_width;//设置默认最大宽度
            _self.fontSize = 100;//默认字体大小
            _self.ratio = 320 / page_width;
            _self.widthProportion = function () {
                var p = window.innerWidth / _self.width;
                if (p > 1) {
                    return 1;
                }

                if (p < _self.ratio) {
                    return _self.ratio;
                }
                return p;
            };
            _self.changePage = function () {
                document.documentElement.style.fontSize = _self.widthProportion() * _self.fontSize + 'px';
            };
            _self.changePage();
            window.addEventListener("resize", function () {
                _self.changePage();
            }, false);
        }, false);
        return this;
    };

    /*
     * 图片延迟加载
     *
     * imgs 图片数组
     * */
    common.lazyImg = (function () {
        var img_arr = null;
        var i = 0;
        var len = 0;

        function loadImg() {
            var img = new Image();
            img.onload = function () {
                i++;
                if (i < len) {
                    loadImg();
                }
            };
            img.src = img_arr[i];
        }

        return function (imgs) {
            img_arr = imgs;
            len = imgs.length;
            loadImg();
        }
    })();

    /*
     * 背景图片延迟加载
     * @param bimg 背景图片地址属性名,data-属性名 common.lazyBgImg('bimg')
     * */
    common.lazyBgImg = (function () {
        var ele_arr = null;
        var ele_len = 0;
        var i = 0;
        var bgimg = '';

        function loadImg() {
            var img = new Image();
            var ele = ele_arr[i];
            img.onload = function () {
                //console.log(ele);
                ele.style.backgroundImage = 'url(\'' + img.src + '\')';
                i++;
                if (i < ele_len) {
                    loadImg();
                }
            };
            img.src = ele.dataset[bgimg];
        }

        return function (bimg) {
            bgimg = bimg;

            window.addEventListener('load', function () {
                ele_arr = document.querySelectorAll('[data-' + bgimg + ']');
                ele_len = ele_arr.length;
                loadImg();
            }, false);
        }
    })();

    /*
     * 切换帧特效
     * ele,dom元素
     * class_pre，类前缀
     * inter 切换时间，默认200
     * frame_num 帧数
     * one 是否只执行一次，默认false
     * */
    common.changeFrame = (function () {
        return function (ele, class_pre, inter, frame_num, one) {
            var i = 1;
            var forward = true;
            var interval_obj = {};
            interval_obj.timer = setInterval(function () {
                //console.log(forward)
                ele.classList.remove(class_pre + '-' + i);
                if (forward) {
                    if (i >= frame_num) {
                        if (one) {
                            ele.classList.add(class_pre + '-' + i);
                            return;
                        }
                        forward = false;
                        i--;
                    } else {
                        i++;
                    }
                } else {
                    if (i <= 1) {
                        forward = true;
                        i++;
                    } else {
                        i--;
                    }
                }
                ele.classList.add(class_pre + '-' + i);
            }, inter);
            interval_obj.stop = function () {
                //console.log(interval_obj.timer);
                clearInterval(interval_obj.timer);
                interval_obj.timer = null;
                var reg = '(\\s)*' + class_pre + '-(\\d+)';
                ele.className = ele.className.replace(new RegExp(reg), ' ' + class_pre + '-' + 1);
            };
            return interval_obj;
        };
    })();

    /*
     * dom操作
     * */
    common.dom = (function () {
        return {
            eq: function (arr, i) {
                return arr[i];
            }
        };
    })();

    /*
    * 验证
    *
    * */
    common.verify={
        /**
         * 检测字符串是否为空
         * @param str
         * @returns {boolean} true表示字符串为空
         */
        space: function (str) {
            if (!str.replace(/\s/, '')) {
                return true;
            }
            return false;
        },
        /**
         * 手机号
         * @param str
         * @returns {boolean} true表示手机号格式输入正确
         */
        telephone: function (str) {
            if (/^\d{11}$/.test(str)) {
                return true;
            }
            return false;
        }
    };

    /*
     * 翻页
     *
     * afterTouch 翻页之后触发的回调函数
     *
     * */
    common.touchPage = (function () {
        var TouchPage = function (options) {
            this.settings = {
                pages: document.querySelectorAll('section:not(.page-filter)')//有效页面
            };
            options = options || {};
            this.settings.afterTouch = options.afterTouch || function () {

            };
            //开始索引
            this.s_index = 0;
            //当前页面
            this.current_page = null;
            //上一页面
            this.prev_page = null;
            //touch开始位置
            this.start = {
                x: 0,
                y: 0,
                t: 0
            };
            //touch结束位置
            this.end = {
                x: 0,
                y: 0,
                t: 0
            };
            //垂直滑动有效值
            this.pass = {
                running: false,//当前翻页动画是否在运行，默认false
                v_distance: 20,
                time: 300
            };
            this.init();
        };
        TouchPage.prototype = {
            init: function () {
                this.initEvent();
            },
            initEvent: function () {
                //console.log('初始化事件');
                var self = this;
                document.addEventListener('touchstart', function (e) {
                    //console.log('初始化touchstart事件');
                    //console.log(e);
                    self.start.x = e.touches[0].pageX;
                    self.start.y = e.touches[0].pageY;
                    self.start.t = new Date().getTime();
                    //e.preventDefault();
                }, false);
                document.addEventListener('touchend', function (e) {
                    //console.log('初始touchend化事件');
                    //console.log(e);
                    if (self.pass.running)return;
                    self.end.x = e.changedTouches[0].pageX;
                    self.end.y = e.changedTouches[0].pageY;
                    self.end.t = new Date().getTime();
                    var y = self.end.y - self.start.y;
                    var x = self.end.x - self.start.x;
                    if (Math.abs(y) > Math.abs(x)) {//垂直
                        if (Math.abs(y) > self.pass.v_distance) {//大于有效距离
                            if (self.end.t - self.start.t < self.pass.time) {//在有效时间范围内
                                //console.log('可滑动');
                                if (self.end.y > self.start.y) {//上页
                                    self.lastPage();
                                } else {//下页
                                    //console.log('下页');
                                    self.nextPage();
                                }
                            }
                        }
                    }
                    /*if(e.srcElement.id != 'shareBtn'){
                    	e.preventDefault();
                    }*/
                }, false);
            },
            lastPage: function () {
                //console.log('上一页');
                if (this.s_index <= 0) {
                    //console.log('到顶了');
                    return;
                }
                var current = common.dom.eq(this.settings.pages, this.s_index);
                this.s_index--;
                this.pass.running = true;
                var self = this;
                var prev = common.dom.eq(this.settings.pages, this.s_index);
                prev.style.display = 'block';
                prev.style.top = '-100%';
                prev.style.zIndex = 9;
                current.style.zIndex = 8;
                prev.classList.add('transition');
                setTimeout(function () {
                    prev.style.top = 0;
                    setTimeout(function () {
                        current.style.display = 'none';
                        prev.classList.remove('transition');
                        self.pass.running = false;
                        self.current_page = prev;
                        self.prev_page = current;
                        //self.sIndexCall();
                        self.settings.afterTouch(self);
                    }, 500);
                }, 100);
            },
            nextPage: function () {
                //console.log('下一页');
                if (this.s_index >= this.settings.pages.length - 1) {
                    //console.log('到底了');
                    return;
                }
                var current = common.dom.eq(this.settings.pages, this.s_index);
                this.s_index++;
                this.pass.running = true;
                var self = this;
                var next = common.dom.eq(this.settings.pages, this.s_index);
                next.style.display = 'block';
                next.style.top = '100%';
                next.style.zIndex = 9;
                next.classList.add('transition');
                setTimeout(function () {
                    next.style.top = 0;
                    setTimeout(function () {
                        current.style.display = 'none';
                        current.style.zIndex = 8;
                        next.classList.remove('transition');
                        self.pass.running = false;
                        self.current_page = next;
                        self.prev_page = current;
                        //self.sIndexCall();
                        self.settings.afterTouch(self);
                    }, 500);
                }, 100);
            }
        };

        return TouchPage;
    })();

    /*
     * 数字递增效果
     * @param element 填充dom
     * */
    common.numberCount = (function () {
        return function (element) {
        	
            var i = 0;
            var time = new Date().getTime();
            var number = USER_DATA[element.dataset.fieldname]||element.dataset.num;
            var inter = parseInt(number / 20) > 0 ? parseInt(number / 20) : 1;
            return setInterval(function () {
                i += inter;
                if (i >= number || new Date().getTime() - time >= 1000) {
                    element.innerText = number;
                } else {
                    element.innerText = i;
                }
            }, 50);
        }
    })();

    /*
     * loading数字进度
     *  ele 显示的元素
     *  callback 加载回调函数
     * */
    common.loadingCount = function (ele,callback) {
        var i = 0;
        ele.innerText = i;
        var interval = setInterval(function () {
            i += 2;
            if (i <= 98) {
                ele.innerText = i;
            }
            else {
                cInterval();
            }
        }, 100);
        var cInterval=function(){
            clearInterval(interval);
            interval = null;
        };
        window.addEventListener('load', function () {
            cInterval();
            ele.innerText = 100;
            callback();
        },false);
    };
})();