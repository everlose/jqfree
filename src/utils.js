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
});

$.extend({
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
});