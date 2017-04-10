/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	var $ = __webpack_require__(1);

	window.$ = $;


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	var init = __webpack_require__(2);
	var traverse = __webpack_require__(3);
	var dom = __webpack_require__(4);
	var filter = __webpack_require__(5);
	var css = __webpack_require__(6);
	var attributes = __webpack_require__(7);
	var events = __webpack_require__(8);
	var effect = __webpack_require__(9);
	var ajax = __webpack_require__(10);
	var cookie = __webpack_require__(11);
	var utils = __webpack_require__(12);

	//jqfree核心
	var $ = function(selector, context) {
	    return new $.fn.init(selector, context);
	};

	$.fn = $.prototype;

	$.fn.init = init;

	$.fn.init.prototype = $.fn;

	$.extend = $.fn.extend = function (destination, source) {
	    //if source is not exist，copy the destination to this。
	    if (typeof source === 'undefined') {
	        source = destination;
	        destination = this;
	    }
	    for (var property in source) {
	        if (source.hasOwnProperty(property)) {
	            destination[property] = source[property];
	        }
	    }
	    return destination;
	};

	//追加dom节点的遍历操作
	$.fn.extend(traverse);

	//追加dom节点的增删改操作
	$.fn.extend(dom);

	//追加dom节点的过滤查找操作
	$.fn.extend(filter);

	//追加dom的css属性的增删改查操作
	$.fn.extend(css);

	//追加dom的属性的增删改查操作
	$.fn.extend(attributes);

	//追加dom的事件的绑定、解绑、触发操作
	$.fn.extend(events);

	//追加dom元素的展现特效，这里没有加入动画，只有show和hide两个方法
	$.fn.extend(effect);

	//追加ajax请求函数
	$.extend(ajax);

	//追加cookie操作函数
	$.extend(cookie);

	//追加其他工具函数库，如变量类型判断，时间解析函数，url解析函数等
	$.extend(utils);

	module.exports = $;


/***/ },
/* 2 */
/***/ function(module, exports) {

	//初始化jqfree对象函数
	module.exports = function(selector, context) {
	    //if selector is a DOM elements, like $(document.getElementById('#id'))
	    if (selector.nodeType === 1) {
	        this[0] = selector;
	        this.length = 1;
	        return this;
	    } else if (selector.length > 0 && selector[0].nodeType === 1) {
	        //else if selector is a DOM elements Array, like $(document.getElementsByTagName('div'))
	        for (var i = 0, j = selector.length; i < j; i++) {
	            this[i] = selector[i];
	            this.length = i + 1;
	        }
	        return this;
	    } else if (/\<\w+\>/.test(selector)) {
	        //else if, create DOM element if selector container '<...>', like $('<div>test</div>')
	        var parentReg = /\<(\w+)\>(?:[\w\W]+)/,
	            parentMatch = parentReg.exec(selector),
	            parentNode = parentMatch ? parentMatch[1] : '';
	        if (!parentNode) {
	            throw 'the selector can not parse a element';
	        }
	        var contentReg = new RegExp('\<' + parentNode + '\>([\\w\\W]+)\<\/' + parentNode + '\>'),
	            contentMatch = contentReg.exec(selector),
	            contentHTML = contentMatch ? contentMatch[1] : '';
	        var parent = document.createElement(parentNode);
	        parent.innerHTML = contentHTML;
	        this[0] = parent;
	        this.length = 1;
	        return this;
	    }

	    //otherwise use querySelectorAll API。ie8+ Support。
	    var parent = context || document;
	    var nodeList = parent.querySelectorAll(selector);
	    this.length = nodeList.length;
	    this.selector = selector;
	    for (var i=0; i<this.length; i+=1) {
	        this[i] = nodeList[i];
	    }
	    return this;
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	//遍历jqfree对象中的DOM Elements, 实际上是遍历了$.fn.init {0: body, length: 1, selector: "body"}这样的一个伪数组中的类似数组的那一部分

	module.exports = {
	    each: function (func) {
	        var i=0,
	            length = this.length;
	        for (; i<length; i+=1) {
	            func.call(this[i], this[i], i);
	        }
	        return this;
	    },
	    size: function () {
	        return this.length;
	    }
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	//dom操作，增删改查
	module.exports = {
	    append: function (child) {
	        if ($.isString(child)) {
	            child = $(child)[0];
	        }
	        this.each(function(v, k) {
	            v.appendChild(child);
	        });
	        child = null;
	        return this;
	    },
	    prepend: function (child) {
	        if ($.isString(child)) {
	            child = $(child)[0];
	        }
	        this.each(function(v, k) {
	            v.insertBefore(child, v.childNodes[0]);
	        });
	        child = null;
	        return this;
	    },
	    remove: function () {
	        this.each(function(v, k) {
	            v.parentNode.removeChild(v);
	        });
	        return this;
	    },
	    empty: function () {
	        this.each(function(v, k) {
	            v.innerHTML = '';
	        });
	        return this;
	    },
	};


/***/ },
/* 5 */
/***/ function(module, exports) {

	//添加了dom过滤的几个函数，如children、parent、siblings。返回出去的DOM对象会再次被$.fn.init对象包装。

	module.exports = {
	    children: function (selector) {
	        return $(selector, this[0]);
	    },
	    parent: function () {
	        return $(this[0].parentElement);
	    },
	    siblings: function () {
	        var n = (this[0].parentElement || {}).firstChild,
	            elem = this[0]
	            matched = [];
	        for ( ; n; n = n.nextSibling ) {
	            if ( n.nodeType === 1 && n !== elem ) {
	                matched.push(n);
	            }
	        }
	        return $(matched);
	    }
	};


/***/ },
/* 6 */
/***/ function(module, exports) {

	//添加了css的方法，功用同原版jquery。现将css规则转为驼峰式，然后利用style属性插入，如background-color: #FFF，会被当作dom.style.backgroundColor = '#FFF'这样的插入。

	module.exports = {
	    css: function (cssRules, value) {
	        //cssName need to Converted into camel casing。
	        var transformHump = function (name) {
	            return name.replace(/\-(\w)/g, function(all, letter){
	                return letter.toUpperCase();
	            });
	        };
	        if ($.isString(cssRules)) {
	            if ($.isUndefined(value)) {
	                return document.defaultView.getComputedStyle(this[0], null)
	                    .getPropertyValue(cssRules);
	            } else {
	                this.each(function(v, k) {
	                    v.style[transformHump(cssRules)] = value;
	                });
	            }
	        } else {
	            for (var i in cssRules) {
	                this.each(function(v, k) {
	                    v.style[transformHump(i)] = cssRules[i];
	                });
	            }
	        }
	        return this;

	    },
	};


/***/ },
/* 7 */
/***/ function(module, exports) {

	//获取属性，实现了attr，removeAttr，addClass，hasClass，removeClass，data，html这几个api，功能和jq相似。 拿addClass举例来说，classList为H5的API，不支持IE9及以下。所有被匹配的dom元素都会被addClass处理。
	module.exports = {
	    attr: function (attrName, attrValue) {
	        if (!$.isUndefined(attrValue)) {
	            if (attrName === 'value' || attrName === 'href') {
	                this.each(function(v, k) {
	                    v[attrName] = attrValue;
	                });
	            } else {
	                this.each(function(v, k) {
	                    v.setAttribute(attrName, attrValue);
	                });
	            }
	        }
	        return attrName === 'value' || attrName === 'href' ? this[0][attrName] : this[0].getAttribute(attrName);
	    },
	    removeAttr: function (attrName) {
	        this.each(function(v, k) {
	            v.removeAttribute(attrName);
	        });
	        return this;
	    },
	    hasClass: function (className) {
	        //classList are strong，but IE9 does not support。
	        return this[0].classList.contains(className);;
	    },
	    addClass: function (className) {
	        this.each(function(v, k) {
	            //please use 'v.className += className' if you need support IE9.
	            v.classList.add(className);
	        });
	        return this;
	    },
	    removeClass: function (className) {
	        this.each(function(v, k) {
	            v.classList.remove(className);
	        });
	        return this;
	    },
	    data: function (dataName, dataValue) {
	        if (typeof dataValue !== 'undefined') {
	            this.each(function(v, k) {
	                //HTML5，dataset，IE10 does not support。
	                v.dataset[dataName] = dataValue;
	            });
	            return this;
	        } else {
	            //try to parse result to JSON
	            try {
	                return JSON.parse(this[0].dataset[dataName]);
	            } catch (e) {
	                return this[0].dataset[dataName]
	            }

	        }

	    },
	    html: function (htmlText) {
	        if ($.isUndefined(htmlText)) {
	            return this[0].innerHTML;
	        } else {
	            this.each(function(v, k) {
	                v.innerHTML = htmlText;
	            });
	        }
	    },
	};


/***/ },
/* 8 */
/***/ function(module, exports) {

	//event
	module.exports = {
	    on: function (event, func) {
	        this.each(function(v, k) {
	            //dom level 2，IE8 not support。
	            v.addEventListener(event, func, false);
	        });
	        return this;
	    },
	    off: function (event, func) {
	        this.each(function(v, k) {
	            v.removeEventListener(event, func, false);
	        });
	        return this;
	    },
	    trigger: function (type) {
	        var event;
	        if (/^mouse|click/.test(name)) {
	            event = document.createEvent('MouseEvents');
	            event.iniMouseEvent(type, true, true);
	        } else if (/^key/.test(name)) {
	            event = document.createEvent('UIEvents');
	            event.iniUIEvent(type, true, true);
	        } else {
	            event = document.createEvent('HTMLEvents');
	            event.initEvent(type, true, true);
	        }
	        event.eventName = type;
	        event.target = this;
	        this.each(function(v, k) {
	            v.dispatchEvent(event);
	        });
	        return this;
	    }
	};


/***/ },
/* 9 */
/***/ function(module, exports) {

	//effect
	module.exports = {
	    hide: function () {
	        this.each(function() {
	           this.style.display = 'none';
	        });
	        return this;
	    },
	    show: function() {
	        this.each(function() {
	           this.style.display = 'block';
	        });
	        return this;
	    },
	};


/***/ },
/* 10 */
/***/ function(module, exports) {

	//ajax，抽离jsonp，$.jsonp独立于$.ajax，毕竟jsonp的原理和ajax完全没有关系，如果使用$.ajax的话有些误导别人
	module.exports = {
	    ajax: function (opts) {

	        var type = opts.type || 'GET',
	            url = opts.url,
	            params = opts.data,
	            dataType = opts.dataType || 'json';

	        type = type.toUpperCase();

	        if (type === 'GET') {
	            params = (function(obj){
	                var str = '';

	                for(var prop in obj){
	                    str += prop + '=' + obj[prop] + '&'
	                }
	                str = str.slice(0, str.length - 1);
	                return str;
	            })(opts.data);
	            url += url.indexOf('?') === -1 ? '?' + params : '&' + params;
	        }

	        // fetch api，不过fetchapi的数据比xhr请求的数据多包了一层。
	        // if (fetch) {
	        //     var fetchParams = {
	        //         method: type
	        //     };
	        //     if (type === 'POST') {
	        //         fetchParams.body = params;
	        //     }
	        //     if (opts.contentType) {
	        //         fetchParams.headers['Content-Type'] = opts.contentType;
	        //     }
	        //     if (opts.dataType) {
	        //         fetchParams.headers['Accept'] = opts.dataType;
	        //     }
	        //     return fetch(opts.url, fetchParams);
	        // }

	        var xhr = new XMLHttpRequest();
	        xhr.open(type, url);

	        if (opts.contentType) {
	            xhr.setRequestHeader('Content-type', opts.contentType);
	        }

	        xhr.send(params ? params : null);

	        //return promise
	        return new Promise(function (resolve, reject) {
	            //onload are executed just after the sync request is comple，
	            //please use 'onreadystatechange' if need support IE9-
	            xhr.onload = function () {
	                if (xhr.status === 200) {
	                    var result;
	                    try {
	                        result = JSON.parse(xhr.response);
	                    } catch (e) {
	                        result = xhr.response;
	                    }
	                    resolve(result);
	                } else {
	                    reject(xhr.response);
	                }
	            };

	        });
	    },
	    jsonp: function (opts) {
	        //to produce random string
	        var generateRandomAlphaNum = function (len) {
	            var rdmString = '';
	            for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
	            return rdmString.substr(0, len);
	        }
	        var url = typeof opts === 'string' ? opts : opts.url,
	            callbackName = opts.callbackName || 'jsonpCallback' + generateRandomAlphaNum(10),
	            callbackFn = opts.callbackFn || function () {};
	        if (url.indexOf('callback') === -1) {
	            url += url.indexOf('?') === -1 ? '?callback=' + callbackName :
	                '&callback=' + callbackName;
	        }
	        if (typeof opts === 'object') {
	            var params = (function(obj){
	                var str = '';

	                for(var prop in obj){
	                    str += prop + '=' + obj[prop] + '&'
	                }
	                str = str.slice(0, str.length - 1);
	                return str;
	            })(opts.data);
	            url += '&' + params;
	        }
	        var eleScript= document.createElement('script');
	        eleScript.type = 'text/javascript';
	        eleScript.id = 'jsonp';
	        eleScript.src = url;
	        document.getElementsByTagName('HEAD')[0].appendChild(eleScript);


	        // window[callbackName] = callbackFn;
	        //return promise
	        return new Promise(function (resolve, reject) {
	            window[callbackName] = function (json) {
	                resolve(json);
	            }

	            //onload are executed just after the sync request is comple，
	            //please use 'onreadystatechange' if need support IE9-
	            eleScript.onload = function () {
	                //delete the script element when a request done。
	                document.getElementById('jsonp').outerHTML = '';
	                eleScript = null;
	            };
	            eleScript.onerror = function () {
	                document.getElementById('jsonp').outerHTML = '';
	                eleScript = null;
	                reject('error');

	            }
	        });
	    }
	};


/***/ },
/* 11 */
/***/ function(module, exports) {

	//将增删改查cookie操作都用一个函数搞定
	module.exports = {
	    cookie: function (cookieName, cookieValue, day) {
	        var readCookie = function (name) {
	            var arr,
	                reg = new RegExp('(^| )' + name + '=([^;]*)(;|$)'),
	                matched = document.cookie.match(reg);
	            if(arr = matched) {
	                return unescape(arr[2]);
	            } else {
	                return null;
	            }
	        };
	        var setCookie = function (name, value, time) {
	            var Days = time || 30;
	            var exp = new Date();
	            exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	            document.cookie = name + "="+ escape (value) + ";expires=" + exp.toGMTString();
	        };
	        if (cookieName && cookieValue) {
	            //set cookie
	            setCookie(cookieName, cookieValue, day);
	        } else if (cookieName && $.isNull(cookieValue)) {
	            //delete cookie
	            setCookie(cookieName, '', -1);
	        } else if (cookieName) {
	            //read cookie
	            return readCookie(cookieName);
	        }
	    }
	};


/***/ },
/* 12 */
/***/ function(module, exports) {

	//添加了变量类型判断、时间解析函数、url解析函数、浮点数四舍五入小数位和获取随机位数字符串的辅助函数

	module.exports = {
	    isUndefined: function(obj) {
	        return obj === void 0;
	    },
	    isNull: function(obj) {
	        return obj === null;
	    },
	    isBoolean: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Boolean]';
	    },
	    isNumber: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Number]';
	    },
	    isString: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object String]';
	    },
	    isNaN: function(obj) {
	        return obj !== obj;
	    },
	    isFunction: function(obj) {
	        return typeof obj === 'function';
	    },
	    isDate: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Date]';
	    },
	    isArray: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Array]';
	    },
	    isObject: function(obj) {
	        return Object.prototype.toString.call(obj) === '[object Object]';
	    },
	    has: function(obj, key) {
	        return Object.prototype.hasOwnProperty.call(obj, key);
	    },
	    //To judge whether the array, string, obj is empty
	    isEmpty: function(obj) {
	        if (obj == null) return true;
	        if ($.isArray(obj) || $.isString(obj)) return obj.length === 0;
	        for (var key in obj) if ($.has(obj, key)) return false;
	        return true;
	    },

	    //$.parseTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss')
	    //result: "2016-08-03 16:14:12"
	    parseTime: function (timeStamp, format) {
	        if (!timeStamp || (+timeStamp) !== (+timeStamp)) {
	            return '--';
	        }
	        if (timeStamp.toString().length === 10) {
	            timeStamp = (+timeStamp) * 1000;
	        }
	        var date = new Date(timeStamp);
	        var o = {
	            'M+' : date.getMonth() + 1, //month
	            'D+' : date.getDate(), //day
	            'h+' : date.getHours(), //hour
	            'm+' : date.getMinutes(), //minute
	            's+' : date.getSeconds(), //second
	            'S' : date.getMilliseconds() //millisecond
	        }

	        if(/(Y+)/.test(format)) {
	            format = format.replace(RegExp.$1,
	                (date.getFullYear() + '').substr(4 - RegExp.$1.length));
	        }

	        for(var k in o) {
	            if (new RegExp('('+ k +')').test(format)) {
	                format = format.replace(RegExp.$1,
	                    RegExp.$1.length == 1 ? o[k] : ('00'+ o[k]).substr((''+ o[k]).length));
	            }
	        }
	        return format;
	    },

	    //$.parseUrl(location.href)
	    //return an object contains the folling info.
	    parseUrl: function (url) {
	        var a =  document.createElement('a');
	        a.href = url;
	        return {
	            source: url,
	            protocol: a.protocol.replace(':',''),
	            host: a.hostname,
	            port: a.port,
	            query: a.search,
	            params: (function(){
	                var ret = {},
	                    seg = a.search.replace(/^\?/,'').split('&'),
	                    len = seg.length, i = 0, s;
	                for (;i<len;i++) {
	                    if (!seg[i]) { continue; }
	                    s = seg[i].split('=');
	                    ret[s[0]] = s[1];
	                }
	                return ret;
	            })(),
	            file: (a.pathname.match(/\/([^\/?#]+)$/i) || [,''])[1],
	            hash: a.hash.replace('#',''),
	            path: a.pathname.replace(/^([^\/])/,'/$1'),
	            relative: (a.href.match(/tps?:\/\/[^\/]+(.+)/) || [,''])[1],
	            segments: a.pathname.replace(/^\//,'').split('/')
	        };
	    },

	    //$.toFixedFloat(15.658, 2)
	    //result: 15.66
	    toFixedFloat: function (value, precision) {
	        var power = Math.pow(10, precision || 0);
	        return String(Math.round(value * power) / power);
	    },

	    //for generate random string
	    //$.generateRandomAlphaNum(5)
	    //random result: like "rc3sr".
	    generateRandomAlphaNum: function (len) {
	        var rdmString = '';
	        for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
	        return rdmString.substr(0, len);
	    }
	};


/***/ }
/******/ ]);