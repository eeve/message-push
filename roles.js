var constant = require('./constants');
module.exports = {
    subscribe:{
        name:'订阅者',
        key:constant.ROLE.SUBSCRIBE
    },
    publish:{
        name:'发布者',
        key:constant.ROLE.PUBLISH
    },
    monitor:{
        name:'监控者',
        key:constant.ROLE.MONITOR
    }
};