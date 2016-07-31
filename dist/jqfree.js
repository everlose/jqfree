var $ = function(selector, context) {
    return new $.fn.init(selector, context);
};

$.fn = $.prototype;

$.fn.init = function(selector, context) {
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

//tools function for judge types of variables。
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
})

//traverse
$.fn.extend({
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
    },

});

//document processor。
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

    
});

//DOM element filter
$.fn.extend({
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
});

//css
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
                return this[0].style[transformHump(cssRules)];
            } else {
                this[0].style[transformHump(cssRules)] = value;
            }
        } else {
            for (var i in cssRules) {
                this[0].style[transformHump(i)] = cssRules[i];
            }
        }
        return this;

    },
});

//attributes
$.fn.extend({
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
});


//event
$.fn.extend({
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
    trigger: function (type, data) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        event.data = data || {};
        event.eventName = type;
        event.target = this;
        this.each(function(v, k) {
            v.dispatchEvent(event);
        });
        return this;
    }
});

//effect
$.fn.extend({
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
});

//this promise code refered to this blog
//http://www.cnblogs.com/liuzhenwei/p/5235473.html
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

//ajax
$.extend({
    ajax: function (opts) {
        var xhr = new XMLHttpRequest(),
            type = opts.type || 'GET',
            url = opts.url,
            success = opts.success,
            error = opts.error,
            params;
        
        params = (function(obj){
            var str = '';

            for(var prop in obj){
                str += prop + '=' + obj[prop] + '&'
            }
            str = str.slice(0, str.length - 1);
            return str;
        })(opts.data);
        
        type = type.toUpperCase();

        if (type === 'GET') {
            url += url.indexOf('?') === -1 ? '?' + params : '&' + params;
        }

        xhr.open(type, url);

        if (type === 'POST') {
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }

        xhr.send(params ? params : null);

        //return promise
        return new Promise(function (resolve, reject) {
            //onload are executed just after the sync request is comple，
            //please use 'onreadystatechange' if need support IE9-
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
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
        var url = opts.url,
            callbackName = opts.callbackName || 'jsonpCallback' + generateRandomAlphaNum(10),
            callbackFn = opts.callbackFn || function () {};
        if (url.indexOf('callback') === -1) {
            url += url.indexOf('?') === -1 ? '?callback=' + callbackName :
                '&callback=' + callbackName;
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


//cookie
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
