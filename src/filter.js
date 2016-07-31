$.fn.extend({
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
});