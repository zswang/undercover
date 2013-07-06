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

	//===============================================================

	/**
	 * 词汇集合
	 */
	var words = [
		["肉蒲团", "一路向西"],
		["毛裤", "秋裤", "牛仔裤"],
		["澳大利亚", "新西兰"],
		["电话", "手机"],
		["银行卡", "信用卡", "购物卡"],
		["郭靖", "杨过", "杨康"],
		["加多宝", "王老吉"],
		["3G网", "2G网"],
		["移动", "联通", "电信"],
		["中石油", "中石化"],
		["大黄蜂", "擎天柱"],
		["可乐", "雪碧"]
	];

	shuffle(words);

	var wordIndex = parseInt(Math.random() * words.length);

	var players = [];
	var playState = "gameover";
	var firstPlayer = 0;
	var message = "";
	var playerCount = 4;
	var undercoverCount = 1;
	var blankCount = 0;
	var peopleKey = "";
	var undercoverKey = "";

	function stateChange() {
		$(document).trigger("stateChange", {
		    state: playState,
		    message: message,
		    firstPlayer: firstPlayer,
		    players: players
		});
	}

	function replay(e, options) {
		/* debug start */
		console.log("replay(%s)", JSON.stringify(options));
		/* debug end */
		playerCount = +(options.playerCount || 4);
		undercoverCount = +(options.undercoverCount || 1);
		blankCount = +(options.blankCount || 0);

		wordIndex = (wordIndex + 1) % words.length;
		shuffle(words[wordIndex]);
		
		peopleKey = words[wordIndex][0];
		undercoverKey = words[wordIndex][1];
		blankKey = "";

		players = [];
		
		for (var i = 0; i < playerCount; i++) {
			players.push({
				key: i < undercoverCount ? undercoverKey : (i < undercoverCount + blankCount ? blankKey : peopleKey),
				killed: false, // 是否被杀
				isUndercover: i < undercoverCount, // 是否卧底
				isBlank: i >= undercoverCount && i < undercoverCount + blankCount // 是否白板
			});
		}

		shuffle(players);
		for (var i = 0; i < playerCount; i++) {
			var player = players[i];
			player.index = i; // 序号
		}
		firstPlayer = parseInt(Math.random() * players.length);
		// 保证第一个发话的不是白板
		while (players[firstPlayer].isBlank) {
			firstPlayer = (firstPlayer + 1) % playerCount;
		}
		/* debug start */
		console.log("players: %s", JSON.stringify(players));
		console.log("peopleKey: %o\nundercoverKey: %o\nfirstPlayer: %o", peopleKey, undercoverKey, firstPlayer);
		/* debug end */

		playState = "waiting";
		message = "游戏开始";
		stateChange();
	}

	function kill(e, index) {
		/* debug start */
		console.log("kill(%o)", index);
		/* debug end */
		if (!players[index]) {
			return;
		}
		if (playState == "gameover") {
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
		console.log("killedCount: %o\nundercoverKilledCount: %o", killedCount, undercoverKilledCount);
		/* debug end */

		if (undercoverKilledCount >= undercoverCount) {
			message = "平民取得了胜利！";
			playState = "gameover";
		} else if ((undercoverCount - undercoverKilledCount) * 2 >= (players.length - killedCount)) {
			message = "卧底取得了胜利！";
			playState = "gameover";
		} else {
			message = "革命尚未成功，同志仍需努力！";
			playState = "continue";
		}
		stateChange();
	}
	
	$(document).on("replay", replay);

	$(document).on("kill", kill);

});