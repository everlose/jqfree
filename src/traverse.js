//traverse
$.fn.extend({
    each: function (func) {
        var i=0,
            length = this.length;
        for (; i<length; i+=1) {
            func.call(this[i], this[i], i);
        }
        return this;
    },
    size: function () {
        return this.length;
    },

});