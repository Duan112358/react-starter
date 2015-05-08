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
        unionpay_trade: '/order/v1/unionpay_trade'
    },
    post: function(url, data, cb) {
        request.post(url)
            .send(data)
            .set('Content-Type', 'application/x-www-form-urlencoded')
            .set('Accept', 'application/json')
            .end(function(res){
                cb(JSON.parse(res.text));
            });
    },
    get: function(url, data, cb){
        request.get(url)
            .query(data || {})
            .set('Accept', 'application/json')
            .end(function(res){
                cb(JSON.parse(res.text))
            });
    },
    getquery: function(){
        var search = location.hash.substr(location.hash.indexOf('?') + 1);
        return search.split('&').reduce(function(result, item) {
            values = item.split('=');
            result[values[0]] = values[1];
            return result;
        }, {});
    },
    checkcard: function(card_no, callback){
        return this.post(this.urls.check_card, {card_no: card_no}, callback); 
    },
    auth: function(data, callback){
        return this.post(this.urls.union_auth, data, callback); 
    },
    trade: function(data, callback){
        return this.post(this.urls.union_trade, data, callback); 
    },
    smscode: function(data, callback){
        return this.post(this.urls.vcode, data, callback); 
    }
};

module.exports = Api;
