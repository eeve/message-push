var Log = require('../utils/log');
var logger = new Log('monitor:\t');
var event = require('../utils/events');

var Monitor = function(io){
    io.allMonitor = {};
    var monitor = io
        .of('/monitor')
        .on(event.EVENT_CONNECT, function (socket) {

            logger.info('new socketId:{}',[socket.id]);

            // 接受监控者登录
            socket.on('login', function (info) {
                socket.sid = info.sid;
                io.allMonitor[info.sid] = socket;
                logger.info('login socketId:{}',[socket.id]);
            });
            
            // 监听发布者掉线
            socket.on(event.EVENT_DISCONNECT, function () {
                if(io.allPublish[socket.sid]){
                    delete io.allPublish[socket.sid];
                    logger.info('logout socketId:{}',[socket.id]);
                }
            });

            socket.on('sendMsgToUser', function (data) {
                io.allSubscribe[data.to] && io.allSubscribe[data.to].send(data.msg);
            });

            // 2秒钟更新一次信息
            setInterval(function () {
                socket.emit('monitor',{
                    subscribe: Object.keys(io.allSubscribe),
                    publish: Object.keys(io.allPublish),
                    monitor: Object.keys(io.allMonitor)
                });
            },2000);
            
        });
    return io;
};

module.exports = Monitor;