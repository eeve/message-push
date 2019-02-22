var Promise = require('bluebird');
var constants = require('./constants');
var Dao = require('./dao');
var logger = require('./utils/log');
var Service = function () {};

// 客户端登录逻辑
Service.prototype.login = function(info,socket){
    return new Promise(function (resolve, reject) {
        if(!info){
            return reject('登录信息有误');
        }
        if(!info.type){
            return reject('登录参数有误,找不到客户端类型');
        }
        if(!info.name){
            return reject('登录参数有误,找不到客户端名称');
        }
        if(!info.sid){
            return reject('抱歉你没有权限');
        }

        var role = constants.ROLE[info.type.toUpperCase()];

        if( !role ){
            return reject('错误的角色');
        }

        socket.sid = info.sid;
        socket.user = {
            sid:info.sid,
            type:info.type,
            name:info.name
        };

        // 将客户端信息保存
        if(!Dao.addClient(socket)){
            return reject('此'+ info.type +'已经登录,无需重新登录');
        }

        resolve(info);

    });
};

Service.prototype.isPublish = function(socket){
    return constants.ROLE.PUBLISH == socket.user.type;
};

Service.prototype.clientWithType = function (type) {
    return Dao.allClient(type);
};

Service.prototype.clientWithTypeAndSid = function (type,sid) {
    return this.clientWithType(type)[sid];
};

Service.prototype.logout = function(socket){
    if(socket.user){
        delete Dao.allClient(socket.user.type)[socket.sid];
        logger.info('消息中心:有一个{}掉线了。socketId:{}',[socket.user.type, socket.id]);
    }else{
        logger.info('消息中心:有一个客户端掉线了。socketId:{}',[socket.id]);
    }
};

module.exports = new Service();