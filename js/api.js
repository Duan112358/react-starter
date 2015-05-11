var request = require('superagent');

var Api = {
    urls: {
        // POST {card_no}
        check_card: '/card/v1/check_card',
        // POST {card_no, order_no}
        vcode: '/auth/v1/vcode',
        // POST {card_no, mobile, name, cvv2, expire, ID_number}
        union_auth: '/auth/v1/union_auth',
        // POST {card_no, order_no}
        union_trade: '/order/v1/unionpay_trade'
    },
    params: false,
    post: function(url, data, cb) {
        data.caller = 'h5';
        request.post(url)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            .end(function(res){
                cb(JSON.parse(res.text));
            });
    },
    get: function(url, data, cb){
        data.caller = 'h5';
        request.get(url)
            .query(data || {})
            .set('Accept', 'application/json')
            .end(function(res){
                cb(JSON.parse(res.text))
            });
    },
    getquery: function(){
        if(!this.params){
            var search = location.search.substr(location.hash.indexOf('?') + 1);
            this.params = search.split('&').reduce(function(result, item) {
                values = item.split('=');
                result[values[0]] = values[1];
                return result;
            }, {});
            this.params.amount = this.params.pay_amt;
            this.params.order_no = this.params.order_id;
        } 

        return this.params;
    },
    init: function(bridge){
        window.WebViewJavascriptBridge = bridge;  
    },
    checkcard: function(data, callback){
        return this.post(this.urls.check_card, data, callback); 
    },
    auth: function(data, callback){
        return this.post(this.urls.union_auth, data, callback); 
    },
    trade: function(data, callback){
        return this.post(this.urls.union_trade, data, callback); 
    },
    smscode: function(data, callback){
        return this.post(this.urls.vcode, data, callback); 
    },
    isandroid: function(){
        return /android/i.test(navigator.userAgent);
    },
    send_ios: function(data){
        if(!window.WebViewJavascriptBridge){
           alert(JSON.stringify(data.params)); 
           return;
        }
        window.WebViewJavascriptBridge.send(JSON.stringify(data.params));
    },
    // cross client message transport
    send_msg: function(data){
        if(this.isandroid()){
            var msg = {
                sm: {
                    callback: data.callback,
                    module: data.module
                },
                params: data.params
            };

            window.location.href = 'message:' + JSON.stringify(msg);
        }else{
           this.send_ios(data);
        } 
    }
};

if(!window.WebViewJavascriptBridge){
    document.addEventListener('WebViewJavascriptBridgeReady', function(evt){
        Api.init(evt.bridge);
    }, false);
}


module.exports = Api;
