
var Dao = function () {
    // 存储所有的socket,socket上绑定了两个自定义属性,sid和user({sid:xxx,name:xxx,type:xxx,role:xxx})
    this.db = {
        // 所有订阅者
        subscribe:{},
        // 所有发布者
        publish:{},
        // 所有监控者
        monitor:{}
    };
};

Dao.prototype.addClient = function (socket) {
    var type = socket.user.type;
    if(!this.db[type][socket.sid]){
        this.db[type][socket.sid] = socket;
        return true;
    }else{
        return false;
    }
};

Dao.prototype.allClient = function (type) {
    return this.db[type];
};

Dao.prototype.removeClient = function (socket) {
    var type = socket.user.type;
    if(this.db[type][socket.sid]){
        delete this.db[type][socket.sid];
    }
};

module.exports = new Dao();




