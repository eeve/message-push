var request = require('request');
var Promise = require('bluebird');
var API = {};
var ERROR_CODE = {
    40001:"参数key错误",
    40002:"请求内容info为空",
    40004:"当天请求次数已使用完",
    40007:"数据格式异常"
};
API.queryMessage = function(question){
    return new Promise(function (resolve, reject) {
        request.post({ url:'http://www.tuling123.com/openapi/api', form: { key:'6ee51af35f2f88f4afbef1d3c21686c2', info:question } }, function (error, resp, body) {
            if(!error && resp.statusCode == 200){
                resolve(API.checkCode(JSON.parse(body)));
            }else{
                reject(error);
            }
        });
    });
};

API.checkCode = function(result){
    return new Promise(function (resolve, reject) {
        var errorMsg = ERROR_CODE[result.code];
        if( errorMsg != undefined ){
            reject(errorMsg);
        }else{
            resolve(result.text);
        }
    });
};

module.exports = API;
