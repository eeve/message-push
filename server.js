var express = require('express');
var path = require('path');
var service = require('./services');
var roles = require('./constants').ROLE;
var cookieParser = require('./middleware/socket.io-cookie');
var app = express();

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use('/static', express.static(__dirname + '/public/dist'));
var index = require('./routes/index');
app.use('/', index);

var server = require('http').Server(app);
var io = require('socket.io')(server);
io.use(cookieParser);
// io.use(function(socket, next){
    // if (socket.request.cookies) return next();
    // next(new Error('Authentication error'));
// });
server.listen(8888);

// subscribe.in('subscribe').clients(function(error, clients){
//     if (error) throw error;
//     console.log('全部订阅者数量:',clients.length); // => [Anw2LatarvGVVXEIAAAD]
// });

// 供消息订阅者订阅消息
var publish = require('./socket/publish');
var subscribe = require('./socket/subscribe');
var monitor = require('./socket/monitor');
publish(io);
subscribe(io);
monitor(io);

