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
