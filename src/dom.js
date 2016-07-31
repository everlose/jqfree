//document processor。
$.fn.extend({
    append: function (child) {
        if ($.isString(child)) {
            child = $(child)[0];
        }
        this.each(function(v, k) {
            v.appendChild(child);
        });
        child = null;
        return this;
    },
    prepend: function (child) {
        if ($.isString(child)) {
            child = $(child)[0];
        }
        this.each(function(v, k) {
            v.insertBefore(child, v.childNodes[0]);
        });
        child = null;
        return this;
    },
    remove: function () {
        this.each(function(v, k) {
            v.parentNode.removeChild(v);
        });
        return this;
    },
    empty: function () {
        this.each(function(v, k) {
            v.innerHTML = '';
        });
        return this;
    },
});