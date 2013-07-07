$(function(){
    /**
     * 格式化函数
     * @param {String} template 模板
     * @param {Object} json 数据项
     */
    function format(template, json) {
        return template.replace(/#\{(.*?)\}/g, function(all, key) {
            return json && (key in json) ? json[key] : "";
        });
    }

    function jsonToQuery(json){
        var result = [];
        for (var key in json){
            result.push([encodeURIComponent(key), encodeURIComponent(json[key])].join("="));
        }
        return result.join("&");
    }

    function queryToJson(query){
        var result = {};
        String(query).replace(/([^?&#]+)=([^?&#]*)/g, function(all, name, value){
            result[name] = value;
        });
        return result;
    }

    function getCookie(name) {
    	var match = String(document.cookie).match("(^| )" + name + "=([^;]*)(;|$)");
    	return match && match[2];
    }

	/**
	 * 上报服务器地址
	 */
	var host = 'http://channel.duapp.com/';


    var query = queryToJson(document.location.search);
    var passportInfo;
    var localPassport;
    if (window.localStorage){
        localPassport = localStorage.getItem(host + ':passport');
    }

    /**
     * 执行命令
     * param{Object} details 请求明细
     * param{Function} callback 回调
     */
    function command(details, callback) {
        if (!details) return;
        if (localPassport){
            details.passport = localPassport;
        }
        var url = format('#{host}command?#{query}', {
            host: host,
            query: jsonToQuery(details),

        });
        $.ajax({
            url: url,
            dataType: "jsonp",
            success: function(data) {
            	callback && callback(data);
        	}
    	});
    }

	var hash = document.location.hash;
	if (!hash) {
		return;
	}
	//#key|order|channel
	var map = hash.split(/[,|;#]/g);
	var key = map[1];
	var order = map[2];
	var channel = map[3];
	var token = map[4];

	function savePassport(fields) {
		if (!fields) {
			return;
		}
		$.each(fields, function() {
			var item = this;
	        switch(item.type){
	            case "passport":
	                passportInfo = item.info;
	                var cookiePassport = queryToJson(getCookie('passport'));
	                if (cookiePassport.id == passportInfo.id &&
	                    cookiePassport.visa == passportInfo.visa &&
	                    cookiePassport.mask == passportInfo.mask
	                    ){
	                    localPassport = '';
	                } else {
	                    if (window.localStorage){
	                        localPassport = format('id=#{id}&visa=#{visa}&mask=#{mask}', passportInfo);
	                        localStorage.setItem(host + ':passport', localPassport);
	                    }
	                }
	            break;
	        }
		});
	}

    command({
        channel: channel,
        command: "enter",
        refer: document.referrer
    }, function(data) {
        data = data || {};
        if (data.result != "ok") {
            return;
        }
        savePassport(data.fields);
        command({
        	channel: channel,
        	command: 'next',
        	token: token,
        	order: order
        });
    });
});