var event = require('./event');

var url = require('url');
var zlib = require('zlib');
var crypto = require('crypto');
var querystring = require('querystring');

void function(){
    /**
     * @author 王集鹄(wangjihu，http://weibo.com/zswang)
     */
    function UndercoverPlugin(channel, options){
        this.channel = channel;
        options = options || {};
    }

    UndercoverPlugin.prototype.command = function(fields, passport, query){
        if (!fields || !passport || !query){
            return;
        }
        switch(query.command) {
            case 'next':
                fields.push({
                    type: 'next',
                    token: query.token,
                    order: query.order
                });
                break;
        }
    };

    UndercoverPlugin.prototype.all = function(fields, passport, query){
    };

    exports.create = function(channel, options){
        return new UndercoverPlugin(channel, options);
    };
    
    event.emit('plugin-register', 'undercover', UndercoverPlugin);
}();
