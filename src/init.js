//初始化jqfree对象函数
module.exports = function(selector, context) {
    //if selector is a DOM elements, like $(document.getElementById('#id'))
    if (selector.nodeType === 1) {
        this[0] = selector;
        this.length = 1;
        return this;
    } else if (selector.length > 0 && selector[0].nodeType === 1) {
        //else if selector is a DOM elements Array, like $(document.getElementsByTagName('div'))
        for (var i = 0, j = selector.length; i < j; i++) {
            this[i] = selector[i];
            this.length = i + 1;
        }
        return this;
    } else if (/<[\s\S]+>/.test(selector)) {
        //else if, create DOM element if selector container '<...>', like $('<div>test</div>')
        // var parentReg = /<(\w+)[\s\S]*>([\s\S]*)<\/[\s\S]+>/;
        // var parentMatch = parentReg.exec(selector);
        // var parentNode = parentMatch ? parentMatch[1] : '';
        // if (!parentNode) {
        //     throw 'the selector: "' + selector + '" can not parse a element';
        // }
        // var contentHTML = parentMatch[2];
        // var parent = document.createElement(parentNode);
        // parent.innerHTML = contentHTML;
        // this[0] = parent;
        // this.length = 1;
        //ie 9+，Firefox 12.0，chrome ok。
        var parser = new DOMParser();
        var dom = parser.parseFromString(selector, 'text/xml').children;
        for (var i = 0, j = dom.length; i < j; i++) {
            this[i] = dom[i];
            this.length = i + 1;
        }
        return this;
    }

    //otherwise use querySelectorAll API。ie8+ Support。
    var parent = context || document;
    var nodeList = parent.querySelectorAll(selector);
    this.length = nodeList.length;
    this.selector = selector;
    for (var i=0; i<this.length; i+=1) {
        this[i] = nodeList[i];
    }
    return this;
};
