//this promise code refered to this blog
//http://www.cnblogs.com/liuzhenwei/p/5235473.html
var Promise = function (fn) {
    var state = 'pending';
    var doneList = [];
    var failList= [];
    this.then = function(done ,fail){
        switch(state){
            case 'pending':
                doneList.push(done);
                //每次如果没有推入fail方法，我也会推入一个null来占位
                failList.push(fail || null);
                return this;
                break;
            case 'fulfilled':
                done();
                return this;
                break;
            case 'rejected':
                fail();
                return this;
                break;
        }
    }
    function tryToJson(obj) {
        var value;
        try {
            value = JSON.parse(obj);
        } catch (e) {
            value = obj;
        }
        return value
    }
    function resolve(newValue){
        state = 'fulfilled';
        setTimeout(function(){
            var value = tryToJson(newValue);
            for (var i = 0; i < doneList.length; i++){
                var temp = doneList[i](value);
                if (temp instanceof Promise) {
                    var newP = temp;
                    for (i++; i < doneList.length; i++) {
                        newP.then(doneList[i], failList[i]);
                    }
                } else {
                    value = temp;
                }
            }
        }, 0);
    }
    function reject(newValue){
        state = 'rejected';
        setTimeout(function(){
            var value = tryToJson(newValue);
            var tempRe = failList[0](value);
            //如果reject里面传入了一个promise，那么执行完此次的fail之后，将剩余的done和fail传入新的promise中
            if(tempRe instanceof Promise){
                var newP = tempRe;
                for (i=1;i<doneList.length;i++) {
                    newP.then(doneList[i],failList[i]);
                }
            } else {
                //如果不是promise，执行完当前的fail之后，继续执行doneList
                value = tempRe;
                doneList.shift();
                failList.shift();
                resolve(value);
            }
        }, 0);
    }

    fn(resolve,reject);
}


//ajax
$.extend({
    ajax: function (opts) {
        var xhr = new XMLHttpRequest(),
            type = opts.type || 'GET',
            url = opts.url,
            success = opts.success,
            error = opts.error,
            params;
        
        params = (function(obj){
            var str = '';

            for(var prop in obj){
                str += prop + '=' + obj[prop] + '&'
            }
            str = str.slice(0, str.length - 1);
            return str;
        })(opts.data);
        
        type = type.toUpperCase();

        if (type === 'GET') {
            url += url.indexOf('?') === -1 ? '?' + params : '&' + params;
        }

        xhr.open(type, url);

        if (type === 'POST') {
            xhr.setRequestHeader("Content-type","application/x-www-form-urlencoded");
        }

        xhr.send(params ? params : null);

        //return promise
        return new Promise(function (resolve, reject) {
            //onload are executed just after the sync request is comple，
            //please use 'onreadystatechange' if need support IE9-
            xhr.onload = function () {
                if (xhr.status === 200) {
                    resolve(xhr.response);
                } else {
                    reject(xhr.response);
                }
            };
            
        });
    },
    jsonp: function (opts) {
        //to produce random string
        var generateRandomAlphaNum = function (len) {
            var rdmString = '';
            for (; rdmString.length < len; rdmString += Math.random().toString(36).substr(2));
            return rdmString.substr(0, len);
        }
        var url = opts.url,
            callbackName = opts.callbackName || 'jsonpCallback' + generateRandomAlphaNum(10),
            callbackFn = opts.callbackFn || function () {};
        if (url.indexOf('callback') === -1) {
            url += url.indexOf('?') === -1 ? '?callback=' + callbackName :
                '&callback=' + callbackName;
        }
        var eleScript= document.createElement('script'); 
        eleScript.type = 'text/javascript';
        eleScript.id = 'jsonp';
        eleScript.src = url;
        document.getElementsByTagName('HEAD')[0].appendChild(eleScript);


        // window[callbackName] = callbackFn;
        //return promise
        return new Promise(function (resolve, reject) {
            window[callbackName] = function (json) {
                resolve(json);
            }

            //onload are executed just after the sync request is comple，
            //please use 'onreadystatechange' if need support IE9-
            eleScript.onload = function () {
                //delete the script element when a request done。
                document.getElementById('jsonp').outerHTML = '';
                eleScript = null;
            };
            eleScript.onerror = function () {
                document.getElementById('jsonp').outerHTML = '';
                eleScript = null;
                reject('error');
                
            }
        });
    }
});