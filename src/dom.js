//dom操作，增删改查
module.exports = {
    append: function (child) {
        this.each(function(v, k) {
            if ($.isString(child)) {
                v.innerHTML += child
            } else if (child.nodeType === 1) {
                v.appendChild(child);
            }
        });
        child = null;
        return this;
    },
    prepend: function (child) {
        this.each(function(v, k) {
            if ($.isString(child)) {
                v.innerHTML = child + v.innerHTML;
            } else if (child.nodeType === 1) {
                v.insertBefore(child, v.childNodes[0]);
            }
        });
        child = null;
        return this;
    },
    remove: function () {
        this.each(function(v, k) {
            v.parentNode.removeChild(v);
            v = null;
        });
        return this;
    },
    empty: function () {
        this.each(function(v, k) {
            v.innerHTML = '';
        });
        return this;
    },
    html: function (htmlText) {
        if ($.isUndefined(htmlText)) {
            return this[0].innerHTML;
        } else {
            this.each(function(v, k) {
                v.innerHTML = htmlText;
            });
        }
    }
};
