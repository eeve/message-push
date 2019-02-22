var winston = require('winston');
var logger = new (winston.Logger)({
    level: 'info',
    transports: [
        new (winston.transports.Console)(),
        new (winston.transports.File)({
            name: 'info-file',
            filename: './logs/filelog-info.log',
            level: 'info'
        }),
        new (winston.transports.File)({
            name: 'error-file',
            filename: './logs/filelog-error.log',
            level: 'error'
        })
    ]
});

// 将log中的{}参数,替换为真正的参数
function renderMsg(tpl,data){
    if(data){
        var i = 0;
        while(/\{*\}/.test(tpl)){
            tpl = tpl.replace(/\{*\}/,data[i]);
            i++;
        }
    }
    return tpl;
}

var Log = function(prefix){
    this.prefix = prefix || '';
};

Log.prototype.log = function (type,log,data) {
    logger.log(type, this.prefix + renderMsg(log,data));
};
Log.prototype.info = function (log,data) {
    logger.info(this.prefix + renderMsg(log,data));
};
Log.prototype.debug = function (log,data) {
    logger.debug(this.prefix + renderMsg(log,data));
};
Log.prototype.error = function (log,data) {
    logger.error(this.prefix + renderMsg(log,data));
};
Log.prototype.warn = function (log,data) {
    logger.warn(this.prefix + renderMsg(log,data));
};

module.exports = Log;
