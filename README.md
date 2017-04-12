# 项目说明

## 项目启动步骤

1. `git clone` 下来项目
2. 运行 `npm install` 安装依赖
3. 运行 `npm run test` 启动项目，并自动访问 `localhost:8088/index.html`

## 项目目录说明

```
|____dist  源代码编译后的生成文件的目录
| |____bundle.js  生成的js文件
|____src
| |____ajax.js  ajax函数库
| |____attributes.js  dom的属性的增删改查函数
| |____cookie.js  cookie操作函数
| |____core.js  jqfree核心函数
| |____css.js  dom元素上的css样式操作函数
| |____dom.js  dom元素自身的增删改函数
| |____effect.js  dom元素的展现特效，这里没有加入动画，只有show和hide两个方法
| |____events.js  dom的事件的绑定、解绑、触发函数
| |____filter.js  dom元素的过滤查找函数
| |____init.js  初始化jqfree对象的函数
| |____main.js  打包代码的入口文件
| |____traverse.js  dom元素遍历的函数
| |____utils.js  工具函数
|____test  单测目录
| |____api.json  测试接口返回数据
| |____index.html  测试页面，也是 `localhost:8088/index.html` 页面入口
| |____mocha.css  mocha框架带的样式，不需要更改
| |____mocha.js  mocha框架带的脚本，不需要更改
| |____test.js  单元测试的脚本文件
|____CHANGELOG.md  项目变更记录
|____package.json
|____README.md
|____webpack.config.js  webpack配置函数

```


# jqfree

this is an imitation jquery, it has fewer fuctions, but only 400+ lines of code. jqfree can not be used in project, we just take few time to do some research and practice about jquery。

## jqfree core

```javascript
var $ = function(selector, context) {
    return new $.fn.init(selector, context);
};

$.fn = $.prototype;

$.fn.init = function(selector, context) {
    if (selector.nodeType === 1) {
        this[0] = selector;
        this.length = 1;
        return this;
    }
    var parent = context || document; 
    var nodeList = parent.querySelectorAll(selector);
    this.length = nodeList.length;
    for (var i=0; i<this.length; i+=1) {
        this[i] = nodeList[i];
    }
    return this;
};

$.fn.init.prototype = $.fn;
```
我们需要一个包装着DOM Elements的伪数组，此伪数组对象使用原型链去挂载共享的DOM处理方法，原理如下图。
![](http://7xn4mw.com1.z0.glb.clouddn.com/16-7-31/23881940.jpg)

```javascript
//选择器
$('body'); //返回$.fn.init {0: body, length: 1, selector: "body"}
$('.class');
$('#id');
$('#id .class');
```

## extend
jqfree中的extend函数参照了prototype.js的实现方式，$.extend和$.fn.extend功能相同，也都是通过浅拷贝的方式，把第二个参数上的对象扩展添加到第二个参数的对象上，如果没有指定第二个参数，则会把第一个参数添加到this上。需要给DOM元素添加方法的话，使用$.fn.extend如$.fn.append，而需要给全局$对象添加扩展的话，使用$.extend，如$.ajax。
```javascript
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
```

## traverse
遍历jqfree对象中的DOM Elements。实际上是遍历了`$.fn.init {0: body, length: 1, selector: "body"}`这样的一个伪数组中的类似数组的那一部分。
```javascript
$.fn.extend({
    each: function (func) {
        var i=0,
            length = this.length;
        for (; i<length; i+=1) {
            func.call(this[i], this[i], i);
        }
        return this;
    },
});
```
接受一个回调函数，其第一个参数为dom元素，第二个参数为序号，调用代码如
```javascript
$('body').each(function(val, index){
    console.log(val, index)
});
```

## DOM processor。
文档操作。添加了append，prepend，remove，empty的方法，功用同原版jquery。因为生成的$.fn.init是个包含DOM的伪数组，所以操作中就需要遍历这个数组做append操作，目的是为了让选中的所有DOM元素都append一遍。appendChild为DOM level2方法，从IE6开始就支持。
```javascript
$.fn.extend({
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
});
```
调用代码如
```javascript
var element = document.createElement('div');
$('body').append(element);
```

## css
添加了css的方法，功用同原版jquery。现将css规则转为驼峰式，然后利用style属性插入，如`background-color: #FFF`，会被当作`dom.style.backgroundColor = '#FFF'`这样的插入。
```javascript
$.fn.extend({
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
});
```
支持两种写法，参数1和参数2可以互为键值对，或者参数1为一个对象，另外这里只第一个dom元素的css规则生效。调用代码如
```javascript
// 获取选中的第一个元素的某个css属性，其属性名不需要驼峰式写法
$('body').css('font-size');

//设置div元素的css属性。提供了以下两种写法。
$('div').css('color', '#FFF');
$('div').css({
    color: '#FFF',
    background: 'green'
});
```

## DOM filter
添加了dom过滤的几个函数，如children、parent、siblings。返回出去的DOM对象会再次被$.fn.init对象包装。
```javascript
$.fn.extend({
    children: function (selector) {
        return $(selector, this[0]);
    } 
});
```
只对第一个DOM元素生效，调用代码如下：
```javacript
$('body').children('.class'); //获取第一个body元素下的所有class名为'.class'的元素
```


## attributes
获取属性，实现了attr，removeAttr，addClass，hasClass，removeClass，data，html这几个api，功能和jq相似。
拿addClass举例来说，classList为H5的API，不支持IE9及以下。所有被匹配的dom元素都会被addClass处理。
```javascript
$.fn.extend({
    addClass: function (className) {
        this.each(function(v, k) {
            //please use 'v.className += className' if you need support IE9.
            v.classList.add(className);
        });
        return this;
    },
});
```
调用方式如下：
```javascript
$('body').addClass('someClass');
```

## event
事件操作。绑定事件使用on，取消绑定事件使用off，触发事件使用trigger。拿on举例，直接使用了addEventListener监听，不支持IE8及以下。需要支持IE8级以下的话，请使用attachEvent兼容。
```javascript
$.fn.extend({
    on: function (event, func) {
        this.each(function(v, k) {
            //dom level 2，IE8 not support。
            v.addEventListener(event, func, false);
        });
        return this;
    },
});
```
第一个参数为事件名，第二个参数为回调，调用代码如下：
```javascript
$('body').on('click', function(e){
    console.log('click');
})
```

## effect
其他效果，鉴于动画用css3会更直观，所以这里只实现了show和hide两个方法。所有匹配的DOM元素都会被影响，这里只是简单设置了display属性为block或者none，有待改进。
```javascript
$.fn.extend({
    show: function() {
        this.each(function() {
           this.style.display = 'block';
        });
        return this;
    },
});
```
调用代码如下：
```javascript
$('body').hide();
```

## ajax
抽离jsonp，$.jsonp独立于$.ajax，毕竟jsonp的原理和ajax完全没有关系，如果使用$.ajax的话有些误导别人。
$.ajax和$.jsonp方法最后都会返回一个Promise对象，。笔者这里直接使用了ES6提供的Promise对象，ES6提供的Promise在chrome从33版开始支持，IE系列并不支持，如果有需要自己写一个Promise的话请打开下面代码中的注释并加入jqfree.js中。此Promise参照了[这里的方案](https://github.com/panyifei/Front-end-learning/blob/master/%E6%A1%86%E6%9E%B6%E4%BB%A5%E5%8F%8A%E8%A7%84%E8%8C%83/Promise.md)。
```javascript
/* ES6自带了Promise，有需要理解Promise如何实现的话请看这段注释代码
var Promise = function (fn) {
    var state = 'pending';
    var doneList = [];
    var failList= [];
    this.then = function(done ,fail){
        switch(state){
            case 'pending':
                doneList.push(done);
                //每次如果没有推入fail方法，我也会推入一个null来占位
                failList.push(fail || null);
                return this;
                break;
            case 'fulfilled':
                done();
                return this;
                break;
            case 'rejected':
                fail();
                return this;
                break;
        }
    }
    function tryToJson(obj) {
        var value;
        try {
            value = JSON.parse(obj);
        } catch (e) {
            value = obj;
        }
        return value
    }
    function resolve(newValue){
        state = 'fulfilled';
        setTimeout(function(){
            var value = tryToJson(newValue);
            for (var i = 0; i < doneList.length; i++){
                var temp = doneList[i](value);
                if (temp instanceof Promise) {
                    var newP = temp;
                    for (i++; i < doneList.length; i++) {
                        newP.then(doneList[i], failList[i]);
                    }
                } else {
                    value = temp;
                }
            }
        }, 0);
    }
    function reject(newValue){
        state = 'rejected';
        setTimeout(function(){
            var value = tryToJson(newValue);
            var tempRe = failList[0](value);
            //如果reject里面传入了一个promise，那么执行完此次的fail之后，将剩余的done和fail传入新的promise中
            if(tempRe instanceof Promise){
                var newP = tempRe;
                for (i=1;i<doneList.length;i++) {
                    newP.then(doneList[i],failList[i]);
                }
            } else {
                //如果不是promise，执行完当前的fail之后，继续执行doneList
                value = tempRe;
                doneList.shift();
                failList.shift();
                resolve(value);
            }
        }, 0);
    }

    fn(resolve,reject);
}
*/
$.extend({
    ajax: function (opts) {
        var xhr = new XMLHttpRequest(),
            type = opts.type || 'GET',
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
});
```

$.ajax接受一个对象作为参数，并且支持使用promise的写法，调用如下
```javascript
$.ajax({
    url: '/test.json'
})
.then(function (d) {
    console.log(d);

    return $.ajax({
        url: '/test.json'
    })
}, function (d) {
    console.log(d);
})
.then(function (d) {
    console.log(d);
}, function (d) {
    console.log(d);
});

//jsonp也可以接受一个url字符串作为参数。
$.jsonp({
    url: '/test.json',
})
.then(function (d) {
    console.log(d);

    return $.jsonp({
        url: '/test.json'
    })
}, function (d) {
    console.log(d);
})
.then(function (d) {
    console.log(d);
}, function (d) {
    console.log(d);
});
```
注意，本地没法测试ajax函数，如果有需要请在此项目目录下运行`node server.js`，接着去打开test.html文件的关于ajax的注释，再去`localhost:3000/test.html`就能看到测试ajax的内容。

### cookie
将增删改查cookie操作都用一个函数搞定
```javascript
$.extend({
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
});
```
调用代码如下：
```javascript
//添加cookie，前两个参数为cookie名和值，必填。第三个参数设置cookie有效时常，单位为天，可选。
$.cookie('test', 'content');
//读取cookie，只填第一个参数
$.cookie('test'); //"content"
//删除cookie, 第二个参数填null
$.cookie('test', null);
```

### utils
添加了变量类型判断、时间解析函数、url解析函数、浮点数四舍五入小数位和获取随机位数字符串的辅助函数。
```javascript
$.extend({
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
    ......
});
$.extend({
    //$.parseTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss')
    //result: "2016-08-03 16:14:12"
    parseTime: function (timeStamp, format) {
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
});
```
调用如下：
```javascript
//参数1是时间戳，参数2是格式，年为Y，月为M，日为D，时h，分m，秒s，毫秒S，注意大小写，多余的位数补0
$.parseTime(new Date().getTime(), 'YYYY-MM-DD hh:mm:ss'); //"2016-08-03 16:14:12"。

//参数为url链接
$.parseUrl(location.href); //返回一个带诸多url信息的对象。

//参数1是目标浮点数，参数2是保留到第几位小数
$.toFixedFloat(15.658, 2); //四舍五入到两位小数：15.66

//参数为生成随机的字符串长度
$.generateRandomAlphaNum(5); //如"rc3sr"
```

## 说明
jqfree纯粹研究用，不考虑诸多兼容。算上注释也就只有400行，可以简单研究一下其代码是如何构建的。从jq毕业一阵子了，总得写点东西纪念下老伙计。[github地址在这里](https://github.com/everlose/jqfree)，有启发的话请不吝给我的github点赞。

## 参考
* [张鑫旭 jQuery诞生记-原理与机制](http://www.zhangxinxu.com/wordpress/2013/07/jquery-%E5%8E%9F%E7%90%86-%E6%9C%BA%E5%88%B6/)
* [阮一峰 如何做到jquery-free](http://www.ruanyifeng.com/blog/2013/05/jquery-free.html)
* [extend 方法在js框架中的设计](http://www.cnblogs.com/yupeng/archive/2012/03/11/2389997.html) 
* [刘镇维 Promise简单实现（正常思路版）](http://www.cnblogs.com/liuzhenwei/p/5235473.html)
* [JS设置cookie、读取cookie、删除cookie](http://www.jb51.net/article/64330.htm)
