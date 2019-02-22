var io = require('socket.io-client');
var Push = require('push.js/push.js');

var messagesBox =document.getElementById('messages');
var connectBtn = document.getElementById('connectBtn');
var name = document.getElementById('name');

var subscribe = io.connect('http://0.0.0.0:8888/subscribe');
subscribe.on('connect', function () {

    console.log('连接上服务器...');

    // 订阅业务消息
    subscribe.on('receive', function (message) {
        messagesBox.value = messagesBox.value + '\n'+ JSON.stringify(message);
        Push.create('系统消息!', {
            body: message.content,
            icon: {
                x16: './icon_msg_s.png',
                x32: './icon_msg_l.png'
            },
            timeout: 3000,
            onClick:function(){
                console.log('点击了消息。。。。');
            }
        });
    });

    // 订阅只针对我的消息
    subscribe.on('message', function (message) {
        messagesBox.value = messagesBox.value + '\n只针对我:'+ JSON.stringify(message);
        Push.create('私信消息!', {
            body: message.content,
            icon: {
                x16: './icon_msg_s.png',
                x32: './icon_msg_l.png'
            },
            timeout: 3000
        });
    });

    subscribe.on('disconnect',function(){
        //连接断开
        alert('断开连接');
    });
});

connectBtn.onclick = function(e){
    e.preventDefault();
    // 登录
    subscribe.emit('login', {
        name: name.value,
        type: 'subscribe',
        sid: 'subscribe_'+name.value
    });
};
