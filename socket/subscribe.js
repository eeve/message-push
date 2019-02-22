var Log = require('../utils/log');
var logger = new Log('subscribe:\t');
var event = require('../utils/events');

var Subscribe = function (io) {
    io.allSubscribe = {};

    var subscribe = io
        .of('/subscribe')
        .on(event.EVENT_CONNECT, function (socket) {
            logger.info('new socketId:{}',[socket.id]);

            // 接受客户端登录
            socket.on('login', function (info) {
                socket.sid = info.sid;
                io.allSubscribe[info.sid] = socket;
                logger.info('login socketId:{}',[socket.id]);
            });

            // 监听客户端掉线
            socket.on(event.EVENT_DISCONNECT, function () {
                if(io.allSubscribe[socket.sid]){
                    delete io.allSubscribe[socket.sid];
                    logger.info('logout socketId:{}',[socket.id]);
                }
            });

            // 每隔一秒检查待发消息队列,如果有消息,则按队列顺序发送
            setInterval(function () {
                if(io.subscribeMsgQueue && io.subscribeMsgQueue.length>0){
                    var message = io.subscribeMsgQueue.pop();
                    subscribe.emit('receive', message);
                }
            },1000);

        });

    return io;
};

module.exports = Subscribe;