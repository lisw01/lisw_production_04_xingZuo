/**
 *作者:李双武
 * 描述:前端框架
 */
(function (w) {
    //创建框架类
    var Lisw = function () {
    };
//继承方法
    Lisw.prototype = {
        //核心继承 ★★★★★
        extend: function (tar, source) {
            for (var i in source) {
                tar[i] = source[i];
            }
            return tar;
        },
        id: function (str) {
            return document.getElementById(str)
        },
        tag: function (tag) {
            return document.getElementsByTagName(tag)
        },
        //去除左边空格
        ltrim: function (str) {
            return str.replace(/(^\s*)/g, '');
        },
        //去除右边空格
        rtrim: function (str) {
            return str.replace(/(\s*$)/g, '');
        },
        //去除空格
        trim: function (str) {
            return str.replace(/(^\s*)|(\s*$)/g, '');
        },
        //ajax - 前面我们学习的
        myAjax: function (URL, fn) {
            var xhr = createXHR();	//返回了一个对象，这个对象IE6兼容。
            xhr.onreadystatechange = function () {
                if (xhr.readyState === 4) {
                    if (xhr.status >= 200 && xhr.status < 300 || xhr.status == 304) {
                        fn(xhr.responseText);
                    } else {
                        alert("错误的文件！");
                    }
                }
            };
            xhr.open("get", URL, true);
            xhr.send();

            //闭包形式，因为这个函数只服务于ajax函数，所以放在里面
            function createXHR() {
                //本函数来自于《JavaScript高级程序设计 第3版》第21章
                if (typeof XMLHttpRequest != "undefined") {
                    return new XMLHttpRequest();
                } else if (typeof ActiveXObject != "undefined") {
                    if (typeof arguments.callee.activeXString != "string") {
                        var versions = ["MSXML2.XMLHttp.6.0", "MSXML2.XMLHttp.3.0",
                                "MSXML2.XMLHttp"
                            ],
                            i, len;

                        for (i = 0, len = versions.length; i < len; i++) {
                            try {
                                new ActiveXObject(versions[i]);
                                arguments.callee.activeXString = versions[i];
                                break;
                            } catch (ex) {
                                //skip
                            }
                        }
                    }

                    return new ActiveXObject(arguments.callee.activeXString);
                } else {
                    throw new Error("No XHR object available.");
                }
            }
        },
        //tab
        tab: function (id) {
            //如何获取某个父元素下面的子元素
            var box = document.getElementById(id);
            var spans = box.getElementsByTagName('span');
            var lis = box.getElementsByTagName('li');


            //两步走
            //第一步: 先把上半部分实现
            //群体绑定事件  -- 对所有的span绑定事件
            //群体绑定事件
            for (var i = 0; i < spans.length; i++) {
                //相亲法则  -- 给男一号一个代号  --  怎么给 -- 自定义属性
                spans[i].index = i;
                spans[i].onmouseover = function () {
                    //排他思想 --  将所有的span置为默认状态  --- 然后再将当前鼠标移上的span置为class -- select
                    for (var i = 0; i < spans.length; i++) {
                        spans[i].className = '';
                        lis[i].className = '';
                    }
                    this.className = 'select';
                    lis[this.index].className = 'select';
                }
            }

        },
        //简单的数据绑定formateString
        formateString: function (str, data) {
            return str.replace(/@\((\w+)\)/g, function (match, key) {
                return typeof data[key] === "undefined" ? '' : data[key]
            });
        },
        /*获取页面传递过来的参数*/
        simpleQuery:function (){
            var params= window.location.search;//params:?id,date
            var arr = params.substring(1).split(",");
            return arr;
        },
        querystring: function(){//获取URL查询字符串参数值的通用函数
            var str = window.location.search.substring(1);//获取查询字符串，即"id=1&name=location"的部分
            var arr = str.split("&");//以&符号为界把查询字符串分割成数组
            var json = {};//定义一个临时对象
            for(var i=0;i<arr.length;i++)//遍历数组
            {
                var c = arr[i].indexOf("=");//获取每个参数中的等号小标的位置
                if(c==-1) continue;//如果没有发现测跳到下一次循环继续操作
                var d = arr[i].substring(0,c);//截取等号前的参数名称，这里分别是id和name
                var e = arr[i].substring(c+1);//截取等号后的参数值
                json[d] = e;//以名/值对的形式存储在对象中
            }
            return json;//返回对象
        },
        //给一个对象扩充功能
        extendMany: function () {
            var key, i = 0, len = arguments.length, target = null, copy;
            if (len === 0) {
                return;
            } else if (len === 1) {
                target = this;
            } else {
                i++;
                target = arguments[0];
            }
            for (; i < len; i++) {
                for (key in arguments[i]) {
                    copy = arguments[i][key];
                    target[key] = copy;
                }
            }
            return target;
        },
        //随机数
        random: function (begin, end) {
            return Math.floor(Math.random() * (end - begin)) + begin;
        },
        //数据类型检测
        isNumber: function (val) {
            return typeof val === 'number' && isFinite(val)
        },
        isBoolean: function (val) {
            return typeof val === "boolean";
        },
        isString: function (val) {
            return typeof val === "string";
        },
        isUndefined: function (val) {
            return typeof val === "undefined";
        },
        isObj: function (str) {
            if (str === null || typeof str === 'undefined') {
                return false;
            }
            return typeof str === 'object';
        },
        isNull: function (val) {
            return val === null;
        },
        isArray: function (arr) {
            if (arr === null || typeof arr === 'undefined') {
                return false;
            }
            return arr.constructor === Array;
        }
    };
//实例化，这样外面使用的使用就不用实例化了
    var lisw = new Lisw();


//事件框架
    lisw.extend(lisw, {
//绑定事件on
        on: function (id, type, fn) {
            var dom = lisw.isString(id) ? document.getElementById(id) : id;
            if (dom.addEventListener) {
                dom.addEventListener(type, fn, false);
            } else if (dom.attachEvent) {
                //兼任ie
                dom.attachEvent("on" + type, fn);
            }
        },
        //解除绑定
        un: function (id, type, fn) {
            var dom = lisw.isString(id) ? document.getElementById(id) : id;
            if (dom.removeEventListener) {
                dom.removeEventListener(type, fn);
            } else if (dom.detachEvent) {
                dom.detachEvent(type, fn);
            }
        },
        //点击事件
        click: function (id, fn) {
            this.on(id, 'click', fn);
        },
        //鼠标移动上面
        mouseover: function (id, fn) {
            this.on(id, 'mouseover', fn);
        },
        //鼠标移动到外面
        mouseout: function (id, fn) {
            this.on(id, 'mouseout', fn);
        },
        //移上移出
        hover: function (id, over, out) {
            if (over) {
                this.on(id, 'mouseover', over);
            }
            if (out) {
                this.on(id, 'mouseout', out);
            }
        },
        //事件属性
        getEvent: function (event) {
            //兼任ie
            return event ? event : window.event;
        },
        getTarget: function (event) {
            //兼容ie
            var e = lisw.getEvent(event);
            return e.target || e.srcElement;
        },
        //阻止默认行为
        preventDefault: function (event) {
            var e = lisw.getEvent(event);
            if (e.preventDefault) {
                e.preventDefault();
            } else {
                e.returnValue = false;
            }
        },
        //阻止冒泡
        stopPropagation: function (event) {
            var e = lisw.getEvent(event);
            if (e.stopPropagation) {
                e.stopPropagation();
            } else {
                e.cancelBubble = true;
            }
        },
        //事件委托
        delegate: function (id, eventType, selector, fn) {
            //参数处理
            var parent = lisw.id(id);

            function handle(e) {
                var target = lisw.getTarget(e);
                if (target.nodeName.toLowerCase() === selector || target.id === selector || target.className.indexOf(selector) != -1) {
                    // 在事件冒泡的时候，回以此遍历每个子孙后代，如果找到对应的元素，则执行如下函数
                    // 为什么使用call，因为call可以改变this指向
                    // 大家还记得，函数中的this默认指向window，而我们希望指向当前dom元素本身
                    fn.call(target);
                }
            }

            //当我们给父亲元素绑定一个事件，他的执行顺序：先捕获到目标元素，然后事件再冒泡
            //这里是是给元素对象绑定一个事件
            parent[eventType] = handle;
        },


    });
//dom框架
    lisw.extend(lisw, {
//css设置
        htmlid: function (id, value) {
            lisw.id(id).innerHTML = value;
        },
        cssid: function (id, key, value) {
            lisw.id(id).style[key] = value;
        },
        //给某个元素设置属性
        attrid: function (id, key, value) {
            lisw.id(id)[key] = value;
        },

    });

//选择框架
    lisw.extend(lisw, {
        id: function (str) {
            return document.getElementById(str)
        },
        tag: function (tag, context) {
            if (typeof context == 'string') {
                context = lisw.id(context);
            }
            if (context) {
                return context.getElementsByTagName(tag);
            } else {
                return document.getElementsByTagName(tag);
            }
        },
//class选择器
        class: function (className, context) {
            var elements;
            var dom;
            //如果传递过来的是字符串 ，则转化成元素对象
            if (lisw.isString(context)) {
                context = document.getElementById(context);
            }
            //如果兼容getElementsByClassName
            if (context.getElementsByClassName) {
                return context.getElementsByClassName(className);
            } else {
                //如果浏览器不支持
                dom = context.getElementsByTagName('*');
                for (var i, len = dom.length; i < len; i++) {
                    if (dom[i].className && dom[i].className == className) {
                        elements.push(dom[i]);
                    }
                }
            }
            return elements;
        },
        //分组选择器
        group: function (content) {
            var result = [], doms = [];
            var arr = lisw.trim(content).split(',');
            //alert(arr.length);
            for (var i = 0, len = arr.length; i < len; i++) {
                var item = lisw.trim(arr[i])
                var first = item.charAt(0)
                var index = item.indexOf(first)
                if (first === '.') {
                    doms = lisw.class(item.slice(index + 1))
                    //每次循环将doms保存在reult中
                    //result.push(doms);//错误来源

                    //陷阱1解决 封装重复的代码成函数
                    pushArray(doms, result)

                } else if (first === '#') {
                    doms = [lisw.id(item.slice(index + 1))]//陷阱：之前我们定义的doms是数组，但是id获取的不是数组，而是单个元素
                    //封装重复的代码成函数
                    pushArray(doms, result)
                } else {
                    doms = lisw.tag(item)
                    pushArray(doms, result)
                }
            }
            return result;

            //封装重复的代码
            function pushArray(doms, result) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //层次选择器
        cengci: function (select) {
            //个个击破法则 -- 寻找击破点
            var sel = lisw.trim(select).split(' ');
            var result = [];
            var context = [];
            for (var i = 0, len = sel.length; i < len; i++) {
                result = [];
                var item = lisw.trim(sel[i]);
                var first = sel[i].charAt(0)
                var index = item.indexOf(first)
                if (first === '#') {
                    //如果是#，找到该元素，
                    pushArray([lisw.id(item.slice(index + 1))]);
                    context = result;
                } else if (first === '.') {
                    //如果是.
                    //如果是.
                    //找到context中所有的class为【s-1】的元素 --context是个集合
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray(lisw.class(item.slice(index + 1), context[j]));
                        }
                    } else {
                        pushArray(lisw.class(item.slice(index + 1)));
                    }
                    context = result;
                } else {
                    //如果是标签
                    //遍历父亲，找到父亲中的元素==父亲都存在context中
                    if (context.length) {
                        for (var j = 0, contextLen = context.length; j < contextLen; j++) {
                            pushArray(lisw.tag(item, context[j]));
                        }
                    } else {
                        pushArray(lisw.tag(item));
                    }
                    context = result;
                }
            }

            return context;

            //封装重复的代码
            function pushArray(doms) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //多组+层次
        select: function (str) {
            var result = [];
            var item = lisw.trim(str).split(',');
            for (var i = 0, glen = item.length; i < glen; i++) {
                var select = lisw.trim(item[i]);
                var context = [];
                context = lisw.cengci(select);
                pushArray(context);

            }
            ;
            return result;

            //封装重复的代码
            function pushArray(doms) {
                for (var j = 0, domlen = doms.length; j < domlen; j++) {
                    result.push(doms[j])
                }
            }
        },
        //html5实现的选择器
        all: function (selector, context) {
            context = context || document;
            return context.querySelectorAll(selector);
        },

    });
//封装CSS框架
    lisw.extend(lisw, {
        //样式
        //用法     lisw.css('#dd','backgroundColor','green');
        css: function (context, key, value) {
            var dom = lisw.isString(context) ? lisw.all(context) : context;
            //如果是数组
            if (dom.length) {
                //先骨架骨架 -- 如果是获取模式 -- 如果是设置模式
                //如果value不为空，则表示设置
                if (value) {
                    for (var i = dom.length - 1; i >= 0; i--) {
                        setStyle(dom[i], key, value);
                    }
                    //            如果value为空，则表示获取
                } else {
                    return getStyle(dom[0]);
                }
                //如果不是数组
            } else {
                if (value) {
                    setStyle(dom, key, value);
                } else {
                    return getStyle(dom);
                }
            }
            function getStyle(dom) {
                if (dom.currentStyle) {
                    return dom.currentStyle[key];
                } else {
                    return getComputedStyle(dom, null)[key];
                }
            }

            function setStyle(dom, key, value) {
                dom.style[key] = value;
            }
        },
        //显示
        show: function (content) {
            var doms = lisw.all(content)
            for (var i = 0, len = doms.length; i < len; i++) {
                lisw.css(doms[i], 'display', 'block');
            }
        },
        //隐藏和显示元素
        hide: function (content) {
            var doms = lisw.all(content)
            for (var i = 0, len = doms.length; i < len; i++) {
                lisw.css(doms[i], 'display', 'none');
            }
        },
        //元素高度宽度概述
        //计算方式：clientHeight clientWidth innerWidth innerHeight
        //元素的实际高度+border，也不包含滚动条
        Width: function (id) {
            return lisw.id(id).clientWidth
        },
        Height: function (id) {
            return lisw.id(id).clientHeight
        },


        //元素的滚动高度和宽度
        //当元素出现滚动条时候，这里的高度有两种：可视区域的高度 实际高度（可视高度+不可见的高度）
        //计算方式 scrollwidth
        scrollWidth: function (id) {
            return lisw.id(id).scrollWidth
        },
        scrollHeight: function (id) {
            return lisw.id(id).scrollHeight
        },


        //元素滚动的时候 如果出现滚动条 相对于左上角的偏移量
        //计算方式 scrollTop scrollLeft
        scrollTop: function (id) {
            return lisw.id(id).scrollTop
        },
        scrollLeft: function (id) {
            return lisw.id(id).scrollLeft
        },

        //获取屏幕的高度和宽度
        screenHeight: function () {
            return window.screen.height
        },
        screenWidth: function () {
            return window.screen.width
        },


        //文档视口的高度和宽度
        wWidth: function () {
            return document.documentElement.clientWidth
        },
        wHeight: function () {
            return document.documentElement.clientHeight
        },
        //文档滚动区域的整体的高和宽
        wScrollHeight: function () {
            return document.body.scrollHeight
        },
        wScrollWidth: function () {
            return document.body.scrollWidth
        },
        //获取滚动条相对于其顶部的偏移
        wScrollTop: function () {
            var scrollTop = window.pageYOffset || document.documentElement.scrollTop || document.body.scrollTop;
            return scrollTop
        },
        //获取滚动条相对于其左边的偏移
        wScrollLeft: function () {
            var scrollLeft = document.body.scrollLeft || (document.documentElement && document.documentElement.scrollLeft);
            return scrollLeft
        }


    });
//动画框架
    lisw.extend(lisw, {
        aniMy: function (obj, json, fn, time, speed) {
            clearInterval(obj.timer);
            var time = time || 24;

            obj.timer = setInterval(function () {
                var flag = true;
                for (var attr in json) {
                    //返回当前属性值
                    var currnets = 0;
                    var step = 0;
                    var speed = speed || 8;
                    if (attr == "opacity") {
                        currnets = Math.round(parseInt(getAttr(obj, attr) * speed)) || 0;
                        step = (parseInt(json[attr] * speed) - currnets) / speed;
                    }
                    else {
                        currnets = parseInt(getAttr(obj, attr));
                        step = (json[attr] - currnets) / speed;
                    }
                    step = step > 0 ? Math.ceil(step) : Math.floor(step);
                    if (attr == "opacity") {
                        //高版本
                        if ("opacity" in obj.style) {
                            // obj.style.opacity = json[attr];
                            obj.style.opacity = (currnets + step) / speed;
                        }
                        else {
                            // obj.style.filter = "alpha(opacity = " + json[attr] * 100 + ")";
                            obj.style.filter = "alpha(opacity = " + currnets + step + ")";
                        }
                    }
                    else if (attr == "zIndex") {
                        obj.style.zIndex = json[attr];
                    }
                    else {
                        obj.style[attr] = currnets + step + "px";
                    }
                    if (attr == "opacity") {
                        currnets = currnets / speed;
                    }
                    if (currnets != json[attr]) {
                        flag = false;
                    }
                }
                if (flag) {
                    clearInterval(obj.timer);
                    if (fn) {
                        fn();
                    }
                }
            }, time);
        }


    });
    w.lisw = lisw;

})(window);
