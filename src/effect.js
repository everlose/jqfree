//effect
$.fn.extend({
    hide: function () {
        this.each(function() {
           this.style.display = 'none';
        });
        return this;
    },
    show: function() {
        this.each(function() {
           this.style.display = 'block';
        });
        return this;
    },
});