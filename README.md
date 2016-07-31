# jqfree
this is an imitation jquery, it has fewer fuctions, but only 400+ lines of code. jqfree can not be used in project, we just take few time to do some research and practice about jquery。

## jqfree core

```javascript
var $ = function(selector, context) {
    return new $.fn.init(selector, context);
};

$.fn = $.prototype;

$.fn.init = function(selector, context) {
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

```
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
遍历jqfree对象中的DOM Elements。接受一个回调函数，其第一个参数为dom元素，第二个参数为序号，调用代码如
```javascript
$('body').each(function(val, index){
    console.log(val, index)
});
```

## dom processor。
文档操作。添加了append，prepend，remove，empty的方法，功用同原版jquery。
```javascript
var element = document.createElement('div');
$('body').append(element);
```

## css
添加了css的方法，功用同原版jquery。调用代码如
```javascript
$('body').css('color', '#FFF')
```

## DOM filter
添加了dom过滤的几个函数，如children、parent、siblings，只对第一个DOM元素生效
```
$('body').children('.class'); //获取第一个body元素下的所有class名为'.class'的元素
```


## attributes
获取属性，实现了attr，removeAttr，addClass，hasClass，removeClass，data，html这几个api，功能和jq相似。
```javascript
$('body').addClass('someClass');
```

## event
事件操作。绑定事件使用on，取消绑定事件使用off，触发事件使用trigger。
```
//使用addEventListener，dom2级的操作。
$('body').on('click', function(){
    console.log('click');
})
```

## effect
其他效果，鉴于动画用css3会更直观，所以这里只实现了show和hide两个方法。
```
$('body').hide();
```

## ajax
抽离jsonp，$.jsonp独立于$.ajax，毕竟jsonp的原理和ajax完全没有关系，如果使用$.ajax的话有些误导别人。
$.ajax只接受一个对象作为参数，并且支持使用promise的写法，调用如下
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
添加了cookie操作
```
//添加cookie，前两个参数为cookie名和值，必填。第三个参数设置cookie有效时常，单位为天，可选。
$.cookie('test', 'content');
//读取cookie，只填第一个参数
$.cookie('test'); //"content"
//删除cookie, 第二个参数填null
$.cookie('test', null);
```

## 说明
jqfree纯粹研究用，不考虑诸多兼容。算上注释也就只有400行，可以简单研究一下其代码是如何构建的。从jq毕业一阵子了，总得写点东西纪念下老伙计。
