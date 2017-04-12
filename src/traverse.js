//遍历jqfree对象中的DOM Elements, 实际上是遍历了$.fn.init {0: body, length: 1, selector: "body"}这样的一个伪数组中的类似数组的那一部分

module.exports = {
    each: function (func) {
        var length = this.length;
        for (var i = 0; i < length; i++) {
            func.call(this[i], this[i], i);
        }
        return this;
    },
    size: function () {
        return this.length;
    }
};
