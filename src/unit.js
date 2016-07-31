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