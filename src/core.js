var init = require('./init');
var traverse = require('./traverse');
var dom = require('./dom');
var filter = require('./filter');
var css = require('./css');
var attributes = require('./attributes');
var events = require('./events');
var effect = require('./effect');
var ajax = require('./ajax');
var cookie = require('./cookie');
var utils = require('./utils');

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
