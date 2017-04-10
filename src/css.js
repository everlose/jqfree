//添加了css的方法，功用同原版jquery。现将css规则转为驼峰式，然后利用style属性插入，如background-color: #FFF，会被当作dom.style.backgroundColor = '#FFF'这样的插入。

module.exports = {
    css: function (cssRules, value) {
        //cssName need to Converted into camel casing。
        var transformHump = function (name) {
            return name.replace(/\-(\w)/g, function(all, letter){
                return letter.toUpperCase();
            });
        };
        if ($.isString(cssRules)) {
            if ($.isUndefined(value)) {
                return document.defaultView.getComputedStyle(this[0], null)
                    .getPropertyValue(cssRules);
            } else {
                this.each(function(v, k) {
                    v.style[transformHump(cssRules)] = value;
                });
            }
        } else {
            for (var i in cssRules) {
                this.each(function(v, k) {
                    v.style[transformHump(i)] = cssRules[i];
                });
            }
        }
        return this;

    },
};
