# jqfree
this is an imitation jquery, it has fewer fuctions, but only 300+ lines of code. jqfree can not be used in project, we just take few time to do some research and practice about jquery。

## jqfree core
```javascript
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
```
如上所示，$对象返回一个$.fn.init对象，而$.fn.init则返回一个包装着DOM Elements的伪数组，其prototype对象指向$.prototype。由此core构建完毕。
现在只需要$('.test')就可以获取到一个包装着所有类名为test的DOM Elements的伪数组。

## extend
jqfree中的$.extend和$.fn.extend功能相同，也都是通过浅拷贝的方式。接下来需要给DOM元素添加方法的话，使用$.fn.extend如$.fn.append，而需要给全局$对象添加扩展的话，使用$.extend，如$.ajax。

## traverse
遍历jqfree对象中的DOM Elements。接受一个回调函数，调用代码如`$('.test').each(function(){console.log('test')})`

## document processor。
文档操作。添加了append，prepend，remove的方法，功用同原版jquery。

## css
添加了css的方法，功用同原版jquery。调用代码如`$('.test').css('color', '#FFF')`

## attributes
获取属性，实现了attr，removeAttr，addClass，hasClass，removeClass，data，html这几个api，功能和jq相似。

## event
事件操作。绑定事件使用on，取消绑定事件使用off，触发事件使用trigger。

## effect
其他效果，鉴于动画用css3会更直观，所以这里只实现了show和hide两个方法。

## ajax
抽离jsonp，$.jsonp独立于$.ajax，毕竟jsonp的原理和ajax完全没有关系，如果使用$.ajax的话有些误导别人。
$.ajax只接受一个对象作为参数，调用如下
```javascript
$.ajax({
    url: '/test.json',
    type: 'GET',
    data: {
        hehe: 'aa',
        qwe: 'rr'
    },
    success: function (resp) {
        console.log(resp);
    },
    error: function () {
        console.log('error');
    }

});
```
注意，本地没法测试ajax函数，如果有需要请在此项目目录下运行`node server.js`，接着去打开test.html文件的关于ajax的注释，再去`localhost:3000/test.html`就能看到测试ajax的内容。

## 说明
jqfree纯粹研究用，不考虑诸多兼容。从jq毕业一阵子了，总得写点东西纪念下老伙计。
