var eventCenter = eventCenter || {};

$(function(){
	//===============================================================
	/**
	 * 随机打乱数组
	 * @param{Array} arr 数组对象
	 */
	function shuffle(arr) {
	    for (var i = 0; i < arr.length; i++) {
	        var j = parseInt(Math.random() * (arr.length - i));
	        var t = arr[arr.length - i - 1];
	        arr[arr.length - i - 1] = arr[j];
	        arr[j] = t;
	    }
	}	
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

    function jsonToQuery(json) {
        var result = [];
        for (var key in json) {
            result.push([encodeURIComponent(key), encodeURIComponent(json[key])].join("="));
        }
        return result.join("&");
    }

    function queryToJson(query) {
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
	//===============================================================

	/**
	 * 词汇集合
	 */
	var words = [
		['肉蒲团', '一路向西'],
		['毛裤', '秋裤', '牛仔裤'],
		['澳大利亚', '新西兰'],
		['电话', '手机'],
		['银行卡', '信用卡', '购物卡'],
		['郭靖', '杨过', '杨康'],
		['加多宝', '王老吉'],
		['3G网', '2G网'],
		['移动', '联通', '电信'],
		['中石油', '中石化'],
		['大黄蜂', '擎天柱'],
		['可乐', '雪碧'],
		['微博', '微信', '贴吧'],
		['音乐', '歌曲'],
		['电视', '电影'],
		['蚊子', '苍蝇'],
		['香蕉', '黄瓜'],
		['吸血鬼', '蝙蝠侠'],
		['鸭蛋', '鸡蛋'],
		['鹅', '鸡', '鸭', '鹌鹑'],
		['王昭君', '貂蝉'],
		['听不见', '没看到'],
		['电话线', '网线'],
		['摄像机', '照相机'],
		['玫瑰', '月季'],
		['董永', '许仙'],
		['谢娜', '李湘'],
		['牛奶', '豆浆'],
		['保安', '保镖'],
		['白菜', '生菜'],
		['辣椒', '芥末'],
		['金庸', '古龙'],
		['赵敏', '黄蓉'],
		['海豹', '海狮'],
		['水盆', '水桶'],
		['唇膏', '口红'],
		['烤肉', '涮肉'],
		['气泡', '水泡'],
		['纸巾', '手帕'],
		['杭州', '苏州'],
		['香港', '台湾'],
		['首尔', '东京'],
		['橙子', '橘子'],
		['葡萄', '提子'],
		['太监', '人妖'],
		['蝴蝶', '蜜蜂'],
		['小品', '话剧', '相声'],
		['裸婚', '闪婚'],
		['春节', '圣诞'],
		['吉他', '琵琶'],
		['公交', '地铁'],
		['剩女', '御姐'],
		['童话', '神话'],
		['作家', '编剧'],
		['警察', '捕快'],
		['结婚', '订婚'],
		['奖牌', '金牌'],
		['那英', '韩红'],
		['面包', '蛋糕'],
		['作文', '论文'],
		['油条', '麻花'],
		['壁纸', '贴画'],
		['枕头', '抱枕'],
		['手机', '座机'],
		['同学', '同桌'],
		['婚纱', '喜服'],
		['老佛爷', '老天爷'],
		['魔术师', '魔法师'],
		['鸭舌帽', '遮阳帽'],
		['双胞胎', '龙凤胎'],
		['情人节', '光棍节'],
		['丑小鸭', '灰姑娘'],
		['富二代', '高富帅'],
		['生活费', '零花钱'],
		['麦克风', '扩音器'],
		['图书馆', '图书店', '图书室'],
		['男朋友', '前男友'],
		['洗衣粉', '皂角粉'],
		['牛肉干', '猪肉脯'],
		['泡泡糖', '棒棒糖'],
		['土豆粉', '酸辣粉'],
		['蜘蛛侠', '蝙蝠侠'],
		['口香糖', '木糖醇'],
		['酸菜鱼', '水煮鱼'],
		['小笼包', '灌汤包'],
		['薰衣草', '满天星'],
		['张韶涵', '王心凌'],
		['刘诗诗', '刘亦菲'],
		['甄嬛传', '红楼梦'],
		['甄子丹', '李连杰'],
		['包青天', '狄仁杰'],
		['大白兔', '金丝猴'],
		['果粒橙', '鲜橙多'],
		['沐浴露', '沐浴盐'],
		['洗发露', '护发素'],
		['自行车', '电动车'],
		['班主任', '辅导员'],
		['过山车', '碰碰车'],
		['铁观音', '碧螺春'],
		['十面埋伏', '四面楚歌'],
		['成吉思汗', '努尔哈赤'],
		['谢娜张杰', '邓超孙俪'],
		['福尔摩斯', '工藤新一'],
		['贵妃醉酒', '黛玉葬花'],
		['流星花园', '花样男子'],
		['神雕侠侣', '天龙八部'],
		['天天向上', '非诚勿扰'],
		['勇往直前', '全力以赴'],
		['鱼香肉丝', '四喜丸子'],
		['麻婆豆腐', '皮蛋豆腐'],
		['语无伦次', '词不达意'],
		['鼠目寸光', '井底之蛙'],
		['近视眼镜', '隐形眼镜'],
		['美人心计', '倾世皇妃'],
		['夏家三千金', '爱情睡醒了'],
		['降龙十八掌', '九阴白骨爪'],
		['红烧牛肉面', '香辣牛肉面'],
		['江南style', '最炫民族风'],
		['梁山伯与祝英台', '罗密欧与朱丽叶']
	];

	shuffle(words); // 保证词汇的无序状态

	/**
	 * 词汇序号
	 */
	var wordIndex = parseInt(Math.random() * words.length);
	/**
	 * 玩家列表
	 */
	var players = [];
	/**
	 * 游戏状态
	 */
	var playState = 'gameover';
	/**
	 * 首发玩家序号
	 */
	var firstPlayer = 0;
	/**
	 * 消息提醒
	 */
	var message = '';
	/**
	 * 玩家数
	 */
	var playerCount = 4;
	/**
	 * 卧底数
	 */
	var undercoverCount = 1;
	/**
	 * 白板数
	 */
	var blankCount = 0;
	/**
	 * 平民谜底
	 */
	var peopleKey = '';
	/**
	 * 卧底谜底
	 */
	var undercoverKey = '';
	/**
	 * 白板谜底
	 */
	var	blankKey = '';
	/**
	 * 上报服务器地址
	 */
	var host = 'http://channel.duapp.com/';

	/**
	 * 频道号
	 */
	var channel = parseInt(Math.random() * parseInt("1000", 36)).toString(36);

	/**
	 * 派发状态改变的事件
	 * @see https://github.com/zswang/undercover/wiki/api
	 */
	function stateChange() {
		$(document).trigger('stateChange', {
		    state: playState,
		    message: message,
		    firstPlayer: firstPlayer,
		    players: players
		});
	}

	/**
	 * 重新开始游戏
	 * @param{Object} options 配置
	 */
	function replay(options) {
		/* debug start */
		console.log('replay(%s)', JSON.stringify(options));
		/* debug end */

		playerCount = +(options.playerCount || 4);
		undercoverCount = +(options.undercoverCount || 1);
		blankCount = +(options.blankCount || 0);
		
		// 下一组词汇
		wordIndex = (wordIndex + 1) % words.length;

        // 随机分配词汇
		shuffle(words[wordIndex]);
		peopleKey = words[wordIndex][0];
		undercoverKey = words[wordIndex][1];

		// 构建指定数量的卧底和白板
		players = [];
		for (var i = 0; i < playerCount; i++) {
			players.push({
				key: i < undercoverCount ? undercoverKey : (i < undercoverCount + blankCount ? blankKey : peopleKey),
				killed: false, // 是否被杀
				isUndercover: i < undercoverCount, // 是否卧底
				isBlank: i >= undercoverCount && i < undercoverCount + blankCount // 是否白板
			});
		}

		// 随机排列卧底和平民
		shuffle(players);
		for (var i = 0; i < playerCount; i++) {
			var player = players[i];
			var token = parseInt(Math.random() * parseInt("1000", 36)).toString(36);
			player.index = i; // 序号
			player.token = token;
			player.order = i + 1;
			player.url = format('#{host}##{key}|#{order}|#{channel}|#{token}', {
				host: host,
				key: player.key,
				order: player.order,
				channel: channel,
				token: player.token
			});
		}

		firstPlayer = parseInt(Math.random() * players.length);
		// 保证第一个发话的不是白板
		while (players[firstPlayer].isBlank) {
			firstPlayer = (firstPlayer + 1) % playerCount;
		}

		/* debug start */
		console.log('players: %s', JSON.stringify(players));
		console.log('peopleKey: %o\nundercoverKey: %o\nfirstPlayer: %o', peopleKey, undercoverKey, firstPlayer);
		/* debug end */

		playState = 'waiting';
		message = '游戏开始';
		stateChange();
	}

	/**
	 * 杀掉玩家
	 * @param{Number} index 序号
	 */
	function kill(index) {
		/* debug start */
		console.log('kill(%o)', index);
		/* debug end */
		if (!players[index]) {
			return;
		}
		if (playState == 'gameover') {
			return;
		}
		players[index].killed = true;

		var undercoverKilledCount = 0;
		var killedCount = 0;
		for (var i = 0; i < players.length; i++) {
			var player = players[i];
			if (player.killed) {
				killedCount++;
				if (player.isUndercover) {
			    	undercoverKilledCount++;
			    }	
			}
		}
		/* debug start */
		console.log('killedCount: %o\nundercoverKilledCount: %o', killedCount, undercoverKilledCount);
		/* debug end */

		if (undercoverKilledCount >= undercoverCount) {
			message = '平民取得了胜利！';
			playState = 'gameover';
		} else if ((undercoverCount - undercoverKilledCount) * 2 >= (players.length - killedCount)) {
			message = '卧底取得了胜利！';
			playState = 'gameover';
		} else {
			message = '革命尚未成功，同志仍需努力！';
			playState = 'continue';
		}
		stateChange();
	}
	
	$(document).on('replay', function(e, options) {
		replay(options);
	});

	$(document).on('kill', function(e, index) {
		kill(index);
	});

    //===========network=================

    var query = queryToJson(document.location.search);
    var passportInfo;
    var localPassport;
    if (window.localStorage){
        localPassport = localStorage.getItem(host + ':passport');
    }

	function savePassport(fields) {
		if (!fields) {
			return;
		}
		$.each(fields, function(){
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

    /**
     * 长连接
     */
    function pick(details, callback){
        if (!details || !callback) return;
        var timer = setTimeout(function(){
            timer = 0;
            callback({
                result: "overtime"
            });
            callback = function(){};
        }, 30000);

        if (localPassport){
            details.passport = localPassport;
        }

        var url = format('#{host}pick?#{query}', {
            host: host,
            query: jsonToQuery(details),

        });

        $.ajax({
            url: url,
            dataType: "jsonp",
        	success: function(data) {
	            timer && clearTimeout(timer);
	            timer = 0;
	            if (data.result == 'ok'){
	            	savePassport(data.fields);
	            }
	            callback(data);
            }
        });

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
            	if (data.result == 'ok') {
            		savePassport(data.fields);
        		}
            	callback(data);
        	}
    	});
    }
    /**
     * 当前pick序号
     */
    var seq = 0;
    /**
     * 发起下一次请求
     */
    function nextPick() {
        pick({
            channel: channel,
            seq: seq
        }, function (data) {
            if (!data || data.result != "ok") {
                if (!data || data.result == 'overtime' || 
                    (data.result != "kill" && data.channel == channel)){
                    nextPick();
                }
                return;
            }
            // 所属频道或请求序号不一致
            if (data.channel == channel && seq == data.currSeq) {
                if ('nextSeq' in data) {
                    seq = data.nextSeq;
                }
                if ('fields' in data) {
            		$.each(data.fields, function() {
            			var item = this;
            			console.log(item);
            			if (item.type != 'next') {
            				return;
            			}
            			var index = item.order - 1;
        				var player = players[index];
        				if (player) {
        					if (player.token == item.token) {
								$(document).trigger("next", {
								    index: index
								});
        					}
        				}
            		});
        		}
                setTimeout(function() {
                    nextPick();
                }, 100);
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
        seq = 0;
        setTimeout(function() {
            nextPick();
        }, 0);
    });

});