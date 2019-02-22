var io = require('socket.io-client');

var monitor = io.connect('http://0.0.0.0:8888/monitor');
monitor.on('connect', function () {

    console.log('连接上服务器...');

    // 登录
    monitor.emit('login', {
        name: '监控系统',
        type: 'monitor',
        sid: 'monitor_监控系统'
    });

    var subs = document.getElementById('subs');
    var publish = document.getElementById('publish');
    var mo = document.getElementById('monitor');
    var box = document.getElementById('subscribe');
    var to = document.getElementById('to');
    var message = document.getElementById('message');
    var sendBtn = document.getElementById('sendBtn');
    monitor.on('monitor', function (data) {
        subs.innerHTML = data.subscribe.length;
        publish.innerHTML = data.publish.length;
        mo.innerHTML = data.monitor.length;
        var temp = '';
        for(var i=0;i<data.subscribe.length;i++){
            temp += '\t' +data.subscribe[i];
        }
        box.innerHTML = temp;
    });

    sendBtn.onclick = function () {
        monitor.emit('sendMsgToUser',{
            to: to.value,
            msg: {
                "content":message.value
            }
        });
        return false;
    }

});
