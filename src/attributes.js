//attributes
$.fn.extend({
    attr: function (attrName, attrValue) {
        if (!$.isUndefined(attrValue)) {
            if (attrName === 'value' || attrName === 'href') {
                this.each(function(v, k) {
                    v[attrName] = attrValue;
                });
            } else {
                this.each(function(v, k) {
                    v.setAttribute(attrName, attrValue);
                });
            }
        }
        return attrName === 'value' || attrName === 'href' ? this[0][attrName] : this[0].getAttribute(attrName);
    },
    removeAttr: function (attrName) {
        this.each(function(v, k) {
            v.removeAttribute(attrName);
        });
        return this;
    },
    hasClass: function (className) {
        //classList are strong，but IE9 does not support。
        return this[0].classList.contains(className);;
    },
    addClass: function (className) {
        this.each(function(v, k) {
            //please use 'v.className += className' if you need support IE9.
            v.classList.add(className);
        });
        return this;
    },
    removeClass: function (className) {
        this.each(function(v, k) {
            v.classList.remove(className);
        });
        return this;
    },
    data: function (dataName, dataValue) {
        if (typeof dataValue !== 'undefined') {
            this.each(function(v, k) {
                //HTML5，dataset，IE10 does not support。
                v.dataset[dataName] = dataValue;
            });
            return this;
        } else {
            //try to parse result to JSON
            try {
                return JSON.parse(this[0].dataset[dataName]);
            } catch (e) {
                return this[0].dataset[dataName]
            }
             
        }
        
    },
    html: function (htmlText) {
        if ($.isUndefined(htmlText)) {
            return this[0].innerHTML;
        } else {
            this.each(function(v, k) {
                v.innerHTML = htmlText;
            });
        }
    },
});