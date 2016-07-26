var $ = function(selector, context) {
    return new $.fn.init(selector, context);
};

$.fn = $.prototype;

$.fn.init = function(selector, context) {
    //if selector is a DOM elements, return this elements.
    if (selector.nodeType === 1) {
        return this[0] = selector;
    }
    //otherwise use querySelectorAll API。ie8+ Support。
    var parent = context || document; 
    var nodeList = parent.querySelectorAll(selector);
    this.length = nodeList.length;
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
});

//document processor。
$.fn.extend({
    append: function (child) {
        //At present can only insert DOM element
        this.each(function(v, k) {
            v.appendChild(child);
        });
        return this;
    },
    prepend: function (child) {
        //At present can only insert DOM element
        this.each(function(v, k) {
            v.insertBefore(child, v.childNodes[0])
        });
        return this;
    },
    remove: function () {
        this.each(function(v, k) {
            v.parentNode.removeChild(v);
        });
        return this;
    },
    
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
    addClass: function (className) {
        this.each(function(v, k) {
            //please use 'v.className += className' if you need support IE9.
            v.classList.add(className);
        });
        return this;
    },
    hasClass: function (className) {
        //classList are strong，but IE9 does not support。
        return this[0].classList.contains(className);;
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

        //onload are executed just after the sync request is comple，
        //please use 'onreadystatechange' if need support IE9-
        xhr.onload = function () {
            if (xhr.status === 200) {
                success(JSON.parse(xhr.response));
            } else {
                error(xhr.response);
            }
            
        };
        xhr.send(params ? params : null);
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
            callbackFn = opts.callbackFn;
        if (url.indexOf('callback') === -1) {
            url += url.indexOf('?') === -1 ? '?callback=' + callbackName :
                '&callback=' + callbackName;
        }
        var eleScript= document.createElement('script'); 
        eleScript.type = 'text/javascript'; 
        eleScript.src = url;
        document.getElementsByTagName('HEAD')[0].appendChild(eleScript);

        window[callbackName] = callbackFn

    }
});
