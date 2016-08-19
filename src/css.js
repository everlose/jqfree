$.fn.extend({
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
});