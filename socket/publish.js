var Log = require('../utils/log');
var logger = new Log('publish:\t');
var event = require('../utils/events');

var Publish = function(io){
    io.allPublish = {};
    io.subscribeMsgQueue = [];
    var publish = io
        .of('/publish')
        .on(event.EVENT_CONNECT, function (socket) {

            logger.info('new socketId:{}',[socket.id]);

            // 接受发布者登录
            socket.on('login', function (info) {
                socket.sid = info.sid;
                io.allPublish[info.sid] = socket;
                logger.info('login socketId:{}',[socket.id]);
            });

            // 接收发布者发布的新消息
            socket.on('pushNewMessage', function (data) {
                if(io.allPublish[socket.sid]){ // 已经登录过的才能发送消息
                    var toClientSid = data.receiver;
                    if(toClientSid){
                        logger.info("新消息,需要发送给[指定]订阅者");
                        var skt = io.allSubscribe[toClientSid];
                        if(skt){
                            skt.send(data);
                        }else{
                            logger.info(socket.sid);
                            io.allPublish[socket.sid].emit('clientNotOnline', data);// 数据原样返回
                            logger.info('message : 指定订阅者不在线, 已通知发布者');
                        }
                    }else{
                        logger.info("新消息,需要推送给[所有]订阅者");
                        // 加入待发消息队列
                        io.subscribeMsgQueue.push(data);
                    }
                }else{
                    logger.info('不能识别的发布者。');
                }
            });

            // 监听发布者掉线
            socket.on(event.EVENT_DISCONNECT, function () {
                if(io.allPublish[socket.sid]){
                    delete io.allPublish[socket.sid];
                    logger.info('logout socketId:{}',[socket.id]);
                }
            });
        });
    return io;
};

module.exports = Publish;