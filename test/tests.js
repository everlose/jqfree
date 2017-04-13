var expect = chai.expect;

describe('init：初始化jqfree对象', function() {
    it('选择器是一个DOM元素', function() {
        var dom = $(document.getElementById('mocha'));
        expect(dom.size()).to.be.equal(1);
    });
    it('选择器是包括多个DOM元素的数组', function() {
        var item = document.getElementsByClassName('list-item');
        var length = item.length;
        var doms = $(item);
        expect(doms.size()).to.be.equal(length);
    });
    it('选择器是字符串"#mocha"', function() {
        var dom = $('#mocha');
        expect(dom.size()).to.be.equal(1);
    });
    it('传入的是dom元素的html代码则create dom元素', function() {
        var dom = $('<div class="test">test</div>');
        expect(dom[0].innerHTML).to.be.equal('test');
    });
});

describe('traverse：遍历jqfree对象中的DOM Elements', function() {
    it('each遍历一遍所有的DOM元素', function() {
        var item = document.getElementsByClassName('list-item');
        var doms = $(item);
        doms.each(function (dom, index) {
            var text = 'list-item ' + (index + 1);
            expect(dom.innerHTML).to.be.equal(text);
        });
    });
    it('size获取DOM元素的数量', function() {
        var item = document.getElementsByClassName('list-item');
        var doms = $(item);
        expect(doms.size()).to.be.equal(item.length);
    });
});

describe('dom：DOM元素的增删改查操作', function() {
    it('append追加为最后一个子元素', function() {
        var p = '<p class="fn-append">append函数追加的</p>';
        var $dom = $('.dom');
        $dom.append(p);
        expect($('.fn-append').html()).to.be.equal('append函数追加的');
        $('.fn-append').remove();
    });
    it('prepend插入为第一个子元素', function() {
        var p = '<p class="fn-prepend">prepend函数追加的</p>';
        var $dom = $('.dom');
        $dom.prepend(p);
        expect($('.fn-prepend').html()).to.be.equal('prepend函数追加的');
        $('.fn-prepend').remove();
    });
    it('remove移除某DOM元素', function() {
        var p = '<p class="fn-remove-test">remove</p>';
        var $dom = $('.dom');
        $dom.append(p);
        $('.fn-remove-test').remove();
        expect($('.fn-remove-test').size()).to.be.equal(0);
    });
    it('empty清空某DOM元素内容', function() {
        var p = '<p class="fn-empty">empty</p>';
        var $dom = $('.dom');
        $dom.append(p);
        $('.fn-empty').empty();
        expect($('.fn-empty').size()).to.be.equal(1);
        expect($('.fn-empty').html()).to.be.equal('');
    });
    it('html读取或赋予某DOM元素内容', function() {
        var $domTip = $('.dom .tip');
        expect($domTip.html()).to.be.equal('dom操作');
        var text = 'dom操作：DOM元素的增删改查操作';
        $domTip.html(text);
        expect($domTip.html()).to.be.equal(text);
        $domTip.html('dom操作');
    });
});

describe('filter：DOM元素的筛选操作', function() {
    it('children获取某DOM元素符合所要规则的子元素', function() {
        var $ct = $('.container');
        var text = $ct.children('.paragraph').html();
        expect(text).to.be.equal('单元测试页面');
    });
    it('parent获取某DOM元素的父元素', function() {
        var $ct = $('.container');
        expect($ct.parent()[0]).to.be.equal(document.body);
    });
    it('siblings获取某DOM元素的兄弟元素', function() {
        var $p = $('.paragraph');
        var text = $p.siblings()[0].innerHTML;
        expect(text).to.be.equal('列表：');
    });
});

describe('css：操作DOM元素的样式属性', function() {
    it('css获取和设置DOM元素的某样式', function() {
        var $ct = $('.container');
        $ct.css('padding-top', '10px');
        var css = $ct.css('padding-top')
        expect(css).to.be.equal('10px');
        $ct.css('padding-top', '0');
    });
});


describe('attributes：设置DOM元素的属性', function() {
    it('attr获取和设置DOM元素的某属性', function() {
        var $ct = $('.container');
        $ct.attr('name', 'ctTest');
        var attr = $ct.attr('name');
        expect(attr).to.be.equal('ctTest');
        $ct.removeAttr('name');
    });
    it('removeAttr删除DOM元素的某属性', function() {
        var $ct = $('.container');
        $ct.attr('name', 'ctTest');
        $ct.removeAttr('name');
        expect($ct.attr('name')).not.be.equal('ctTest');
    });
    it('hasClass判断DOM元素上是否有某类', function() {
        var $ct = $('.container');
        expect($ct.hasClass('container')).to.be.equal(true);
    });
    it('addClass & removeClass 添加删除某类', function() {
        var $ct = $('.container');
        $ct.addClass('test');
        expect($ct.hasClass('test')).to.be.equal(true);
        $ct.removeClass('test');
        expect($ct.hasClass('test')).to.be.equal(false);
    });
    it('data获取和设置data-xxx属性', function() {
        var $ct = $('.container');
        $ct.data('test', 'ccc');
        expect($ct.data('test')).to.be.equal('ccc');
        $ct.removeAttr('data-test');
    });
});

describe('event：DOM的事件的绑定、解绑、触发操作', function() {
    it('on & off & trigger 绑定和解绑和触发事件', function() {
        var $p = $('.paragraph');
        var temp = 0;
        var fn = function () {
            temp += 1;
        };
        $p.on('click', fn);
        $p.trigger('click');
        expect(temp).to.be.equal(1);
        $p.trigger('click');
        expect(temp).to.be.equal(2);
        $p.off('click', fn);
        $p.trigger('click');
        expect(temp).to.be.equal(2);
    });
});


describe('effect：DOM元素的展现特效', function() {
    it('show & hide 显示和隐藏DOM元素', function() {
        var $p = $('.paragraph');
        $p.hide();
        expect($p.css('display')).to.be.equal('none');
        $p.show();
        expect($p.css('display')).to.be.equal('block');
    });
});

describe('ajax：网络操作', function() {
    it('GET请求', function() {
        $.ajax({
            url: '/api.json',
            type: 'GET',
        })
        .then(function (d) {
            expect(d.data.data1).to.be.equal('d1');
        }, function (err) {
            console.log(err);
        });
    });
    // it('POST请求', function() {
    //     $.ajax({
    //         url: '/api.json',
    //         type: 'POST',
    //         data: {
    //             test: 1
    //         }
    //     })
    //     .then(function (d) {
    //         expect(d.data.data1).to.be.equal('d1');
    //     })
    // });

    // it('JSONP请求', function() {
    //     $.jsonp({
    //         url: '/api.jsonp'
    //     })
    //     .then(function (d) {
    //         console.log(d.data.data1);
    //         expect(d.data.data1).to.be.equal('d1');
    //     }, function (err) {
    //         console.log(err);
    //     });
    // });

});

describe('cookie：cookie操作', function() {
    it('cookie增删改查cookie', function() {
        $.cookie('jqfreeTest', 'test1', 7);
        expect($.cookie('jqfreeTest')).to.be.equal('test1');
        $.cookie('jqfreeTest', 'test2', 7);
        expect($.cookie('jqfreeTest')).to.be.equal('test2');
        $.cookie('jqfreeTest', null);
        expect($.cookie('jqfreeTest')).to.be.equal(null);
    });
});

