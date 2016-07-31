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
                return this[0].style[transformHump(cssRules)];
            } else {
                this[0].style[transformHump(cssRules)] = value;
            }
        } else {
            for (var i in cssRules) {
                this[0].style[transformHump(i)] = cssRules[i];
            }
        }
        return this;

    },
});