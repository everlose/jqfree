//event
$.fn.extend({
    on: function (event, func) {
        this.each(function(v, k) {
            //dom level 2，IE8 not support。
            v.addEventListener(event, func, false);
        });
        return this;
    },
    off: function (event, func) {
        this.each(function(v, k) {
            v.removeEventListener(event, func, false);
        });
        return this;
    },
    trigger: function (type, data) {
        var event = document.createEvent('HTMLEvents');
        event.initEvent(type, true, true);
        event.data = data || {};
        event.eventName = type;
        event.target = this;
        this.each(function(v, k) {
            v.dispatchEvent(event);
        });
        return this;
    }
});