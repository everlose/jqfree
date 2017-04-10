//添加了dom过滤的几个函数，如children、parent、siblings。返回出去的DOM对象会再次被$.fn.init对象包装。

module.exports = {
    children: function (selector) {
        return $(selector, this[0]);
    },
    parent: function () {
        return $(this[0].parentElement);
    },
    siblings: function () {
        var n = (this[0].parentElement || {}).firstChild,
            elem = this[0]
            matched = [];
        for ( ; n; n = n.nextSibling ) {
            if ( n.nodeType === 1 && n !== elem ) {
                matched.push(n);
            }
        }
        return $(matched);
    }
};
