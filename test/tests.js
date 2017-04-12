var expect = chai.expect;

describe('init初始化jq对象', function() {
    it('选择器是一个DOM元素', function() {
        var dom = $(document.getElementById('mocha'));
        expect(dom.length).to.be.equal(1);
    });
    it('选择器是包括多个DOM元素的数组', function() {
        var item = document.getElementsByClassName('list-item');
        var length = item.length;
        var doms = $(item);
        expect(doms.length).to.be.equal(length);
    });
    it('选择器是字符串"#mocha"', function() {
        var dom = $('#mocha');
        expect(dom.length).to.be.equal(1);
    });
    it('传入的是dom元素的html代码则create dom元素', function() {
        var dom = $('<div>test</div>');
        expect(dom[0].innerHTML).to.be.equal('test');
    });
});
