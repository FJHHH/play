var mouserwheelSize = 2;
var number = 32;
try{
var xhr = new XMLHttpRequest();
var ac = new (window.AudioContext || window.webkitAudioContext)();
var gainNode = ac[ac.createGain?'createGain':'createGainNode']();
var analyser = ac.createAnalyser();
var requestAnimationFrame = window.requestAnimationFrame ||
							window.webkitRequestAnimationFrame ||
							window.mozRequestAnimationFrame;
} catch(e) {
	alert('你的浏览器不支持XMLHttpRequest或者WebAudioAPI');
}
var box;
var height,width;
var w;
var wp = 0.8;//柱状宽度比例
var canvas;
var ctx;
var linearGradient;
var drawMode;
var modeNum = 1;

var dots = [];
var dotsH = 10;
var dotsNum = 0.3;
var ballR;

var ballMaxSpeed = 5;

var pauseFlag = 0;
var arrBuffer;
var startCurrentTime;
var playedTime;

var currentFileNum = 0;
var filelist = [];

var localMusic = 0;//是否使用服务器上的资源

var volTemp;

var counter = 0;

var loadNextDelay = 3000;
var bufferObj = {};//缓存对象，解码所占时间较多，优先缓存解码完毕的buffer
var loading;//若不为空则表示有某首歌正在下载或者解码中
var req2play;//被点击事件要求播放的歌,播放时应
var lrcArrNow = "";
var lrcP;

var reposi = "http://oeyscpawz.bkt.clouddn.com/";

var bufferSourceNow;

function FileObj(obj) {
	this.type = obj.type;
	this.name = obj.name;
	this.href = obj.href;
}

function resize() {
	$(box).css('height',$(window).height() + 'px');
	height = box.clientHeight;
	width = box.clientWidth;
	w = parseInt(width/number);
	dotsH = parseInt(w/5);
	ballR = parseInt(1.5*w);
	canvas.height = height;
	canvas.width = width;
	linearGradient = ctx.createLinearGradient(width/15, 0, 0, height);
	linearGradient.addColorStop(0, '#f00');
	linearGradient.addColorStop(0.5, '#ff0');
	linearGradient.addColorStop(1, '#0f0');
	changeMode(modeNum);
}

$(window).bind('resize', resize);

function bufferSourceEnded(){
	if (bufferSourceNow === this) {
		$('.playbox .pause').removeClass('pause').addClass('play');
		if (pauseFlag === 0) {
			nextMusic();
		}	
	}
}

function load(name) {
	xhr.abort();
	counter++;
	var n = counter;
	loadMusic(name , n, function(arraybuffer, n, isload, name){
		decodeAndPlay(arraybuffer, n, isload, name);
	}, function(buffer, n, name) {
		if (counter === n) {
			startPlay(name);
		}
	});
}

function loadMusic(name , n, callback, callback2) {
	//callback 为需要解码时调用的回调，callback2是缓存对象中已有相应解码过的AudioBuffer数组时调用的回调
	var url = createMusicUrl(name);
	var obj = bufferObj[name];
	if (obj && (obj.arraybuffer || obj.buffer)) {
		var arraybuffer = obj.arraybuffer;
		if (arraybuffer) {
			if (typeof callback === 'function') {
				callback(xhr.response, n, true, name);
			}
		} else {
			var buffer = obj.buffer;
			if (typeof callback2 === 'function') {
				callback2(buffer, n, name);
			}
		}
	} else {
		xhr.open('GET', url);
		xhr.responseType = 'arraybuffer';
		xhr.onload = function() {
			bufferObj[name] = {
				arraybuffer:xhr.response
			};
			loadLrc(name);
			if (typeof callback === 'function') {
				callback(xhr.response, n, true, name);
			}
		};
		xhr.send();
	}
}

function loadNext() {
	//用于预加载，优先级应低于直接点击
	var $now = $('#music_list li.selected');
	var $next = $('#music_list li.selected+li');
	var name;
	if ($now.length === 0 || $next.length === 0) {
		name = $('#music_list li:first-child').attr('title');
	}else {
		name = $next.attr('title');
	}
	if (!loading && !req2play) {
		loading = name;
		loadMusic(name, 0, function(arraybuffer, n, isload, name){
			if ((req2play && req2play !== name) || loading !== name) {
				if (loading === name) {loading = null;}
				console.log(111);
				return;
			}
			decode(arraybuffer, n, isload, name, function(buffer){
				if (req2play === name) {
					startPlay(name);
				}
				loading = null;
			});
		},function(buffer) {
			if (req2play === name) {
				startPlay(name);
			}
			loading = null;
		});
	}
}

function loadLrc(name) {
	//为了偷懒少考虑点对bufferObj的控制，歌词应该最早在下载完成后加载
	var url = createLrcUrl(name);
    var request = new XMLHttpRequest();
    var obj = bufferObj[name];
    if (obj && obj.lyric) {return;}
    request.open('GET', url, true);
    request.responseType = 'text';
    request.onload = function() {
    	var lyric;
    	if (request.status == '404') {
    		lyric = "";
    	} else {
       		lyric = request.response;
    	}
    	var re = parseLyric(lyric);
        obj.lyric = re;
    };
    request.onerror = function() {
    	obj.lyric = "";
    };
    request.send();
}

function parseLyric(text) {
    //将文本分隔成一行一行，存入数组
    if (!text || text == "") { return "";}
    var lines = text.split('\n'),
        //用于匹配时间的正则表达式，匹配的结果类似[xx:xx.xx]
        pattern = /\[\d{2}:\d{2}.\d{2}\]/g,
        //保存最终结果的数组
        result = [];
    //去掉不含时间的行
    while (!pattern.test(lines[0])) {
        lines = lines.slice(1);
    };
    var c = 0;
    var num = lines.length - 1;
    while (!pattern.test(lines[num])) {
        lines = lines.slice(0, num);
        num = lines.length-1;
    };
    //上面用'\n'生成生成数组时，结果中最后一个为空元素，这里将去掉
    lines[lines.length - 1].length === 0 && lines.pop();
    lines.forEach(function(v /*数组元素值*/ , i /*元素索引*/ , a /*数组本身*/ ) {
        //提取出时间[xx:xx.xx]
        var time = v.match(pattern),
            //提取歌词
            value = v.replace(pattern, '');
        //因为一行里面可能有多个时间，所以time有可能是[xx:xx.xx][xx:xx.xx][xx:xx.xx]的形式，需要进一步分隔
        time.forEach(function(v1, i1, a1) {
            //去掉时间里的中括号得到xx:xx.xx
            var t = v1.slice(1, -1).split(':');
            //将结果压入最终数组
            result.push([parseInt(t[0], 10) * 60 + parseFloat(t[1]), value]);
        });
    });
    //最后将结果数组中的元素按时间大小排序，以便保存之后正常显示歌词
    result.sort(function(a, b) {
        return a[0] - b[0];
    });
    return result;
}

function createLrcUrl(name) {
	var url;
	var realname = name.substring(0,name.length-4) + '.lrc';
	if (localMusic == 1) {
		url = '/lrc/' + realname;
	} else {
		url = reposi + realname;
	}
	return url;
}

function createMusicUrl(name) {
	var url;
	if (localMusic == 1) {
		url = '/media/' + name;
	} else {
		url = reposi + name;
	}
	return url;
}

function decodeAndPlay(arraybuffer, n, isload, name) {
	decode(arraybuffer, n, isload, name, startPlay);
}

function decode(arraybuffer, n, isload, name, callback) {
	if (n !== 0 && n !== counter) {return;}
	ac.decodeAudioData(arraybuffer, function(buffer){
		var bobj = bufferObj[name];
		bobj.buffer = buffer;
		bobj.arraybuffer = null;
		if (n !== 0 && n !== counter) {
			return;
		}
		if (typeof callback === 'function') {
			callback(name);
		}
	}, function(err) {
		console.log(err);
	});
}

function startPlay(name) {
	var obj = bufferObj[name];
	var buffer = obj.buffer;
	lrcArrNow = obj.lyric;
	bufferSourceNow && bufferSourceNow[bufferSourceNow.stop?'stop':'noteOff']();
	var bufferSource = createBufferSource(buffer);
	bufferSource.onended = bufferSourceEnded;
	bufferSource[bufferSource.start?'start':'noteOn'](0);
	startCurrentTime = ac.currentTime;
	bufferSourceNow = bufferSource;
	pauseFlag = 0;
	playedTime = 0;
	$('.playbox .play').removeClass('play').addClass('pause');
	req2play = null;
	$('h1').html(name.substring(name.indexOf('-') + 1,name.indexOf('.')).trim());
	setTimeout(loadNext(), loadNextDelay);//开始播放loadNextDelay秒之后预加载下一首歌
}

function createBufferSource(buffer) {
	var bufferSource = ac.createBufferSource();
	bufferSource.buffer = buffer;
	bufferSource.connect(analyser);
	return bufferSource;
}

function changVolume(percent) {
	gainNode.gain.value = percent * percent;
}

function volumeChange() {
	var $volume = $('#volume');
	var val = $volume.val()/$volume.attr('max');
	changVolume(val);
	var klass;
	switch(true) {
		case val > 0.6:
			klass = 'fa-volume-up';
			break;
		case val > 0:
			klass = 'fa-volume-down';
			break;
		default:
			klass = 'fa-volume-off';
	}
	$('#volumelab>label>i').removeClass('fa-volume-up').removeClass('fa-volume-down')
		.removeClass('fa-volume-off').addClass(klass);
}

function visualizer() {
	function v() {
		if (pauseFlag === 0) {
			analyser.getByteFrequencyData(arr);
		}
		draw(arr);
		lrcPro();
		requestAnimationFrame(v);
	}
	requestAnimationFrame(v);
}

function lrcPro() {
	//歌词同步
	if (pauseFlag === 1) {return;}
	if (lrcArrNow == "") {
		$(lrcP).html("暂无歌词");
		return;
	}
	var playedTimeL = playedTime + ac.currentTime - startCurrentTime;
	 for (var i = 0, l = lrcArrNow.length; i < l; i++) {
        if (playedTimeL> lrcArrNow[i][0]) {
            $(lrcP).html(lrcArrNow[i][1]);
        };
    };
}

function draw(arr) {
	ctx.clearRect(0, 0, width, height);
	drawMode(arr);
}


function drawColMode(arr) {
	for (var i = 0; i < number; i++) {
		var d = dots[i];
		var h = arr[i] / 256 *  height;
		var th = parseInt(h + (dotsNum+1)* dotsH);
		if(h === 0) th = dotsH;
		ctx.fillRect(w * i, height - h, w * wp, h);
		if (h > 0 && d.h - h < (dotsNum+1) * dotsH ) {
			d.h = th;
			if (d.h > height) {
				d.h = height;
			}
		}
		ctx.fillRect(w * i, height - d.h , w*wp, dotsH);
		if (d.h > th) {
			d.h --;
		}
	}
}

function drawBallMode(arr) {
	for(var i = number-1; i >= 0; i--) {
		ctx.beginPath();
		var o = dots[i];
		var realx = o.x - ballR;
		var r = parseInt(arr[i]/256*ballR);
		ctx.arc(realx, o.y, r, 0, Math.PI*2, true);
		var g = ctx.createRadialGradient(realx, o.y, 0, realx, o.y, r);
		g.addColorStop(0, '#fff');
		g.addColorStop(1, o.color);
		if (pauseFlag === 0) {
			var temp = o.x;
			o.speed = parseInt((o.speed * 2 + (arr[i]/256*ballMaxSpeed)*2/3)/3 + 0.5);
			o.x = (o.x + o.speed) % (width + 2*ballR);
			if (o.x < temp) {
				o.y = randomInt(0, height);
			}
		}
		ctx.fillStyle = g;
		ctx.fill();
	}
}

function changeMode(mode) {
	switch (mode) {
		case 0:
			change2Col();
			break;
		case 1:
			change2Ball();
			break;
	}
}

function change2Col() {
	ctx.fillStyle = linearGradient;
	drawMode = drawColMode;
	modeNum = 0;
	dots.forEach(function(item){
		item.h = dotsH;
	});
}

function change2Ball() {
	randomDots();
	drawMode = drawBallMode;
	modeNum = 1;
}


function createDots() {
	dotsH = (width/number/2) * wp;
	for(var i = 0; i < number; i++) {
		dots[i] = {
			h : dotsH
		}
	}
}

function randomInt(s, e) {
	return parseInt(Math.random()*(e-s) + s);
}

function randomDots() {
	//随机球模式下球的状态
	dots.forEach(function(item) {
		item.x = randomInt(-ballR, width + ballR);
		item.y = randomInt(0, height);
		item.color = 'rgba(' + randomInt(0, 255) + ',' + randomInt(0, 255) + ',' + randomInt(0, 255) + ', 0)';
		item.speed = randomInt(0, ballMaxSpeed);
	});
}

function nextMusic() {
	var $now = $('#music_list li.selected');
	if ($now.length === 0) {
		$('#music_list li:first-child').trigger('click');
		return;
	}
	var $next = $('#music_list li.selected+li');
	if ($next.length > 0) {
		$next.trigger('click');
	} else {
		$('#music_list li:first-child').trigger('click');
	}

}

function preMusic() {
	var list = $('#music_list li');
	var $now = $('#music_list li.selected');
	var now = $now[0];
	if ($now.length === 0) {
		$('#music_list li:last-child').trigger('click');
		return;
	}
	for (var i = list.length - 1; i >= 0; i--) {
		if (list[i] === now) {
			if (i === 0) {
				$(list[list.length-1]).trigger('click');
			} else {
				$(list[i-1]).trigger('click');
			}
		}
	}
}

function music_listInit() {
	var list = $('#music_list li');
	$(list).each(function(){
		$(this).click(function(){
			if ($(this).hasClass('selected')) {return;}//如果是被选中状态，不做动作
			$(list).each(function(){
				$(this).removeClass('selected');
			});
			$(this).addClass('selected');
			var name = $(this).attr('title')
			req2play = name;
			if (loading === name) {return;}//如果这首歌正在被加载。则不执行下载
			loading = null;//停止正在加载
			load(name);
		});
	});
}

function volumeInit() {
	var $volume = $('#volume');
	$volume.bind('mousemove', volumeChange);
	volumeChange();
	$volume.bind('change', volumeChange);
	$volume.bind('touchmove', volumeChange);
	$('#volumelab').on('mousewheel', function(event) {
		var $volume = $('#volume');
    	var val = parseInt($volume.val());
    	val = val + event.deltaY * mouserwheelSize;
    	switch (true) {
    		case val < 0 :
    			val = 0;
    			break;
    		case val > 100:
    			val = 100;
    			break;
    	}
    	$volume.val(val);
    	volumeChange();
	});
}

function mode_listInit() {
	var modelist = $('.mode_list li');
	$(modelist).each(function(){
		$(this).click(function(){
			var targetMode = $(this).attr('mode');
			$(modelist).each(function(){
				$(this).removeClass('selected');
			});
			$(this).addClass('selected');
			changeMode(parseInt(targetMode));
		});
	});
	$('.mode_list li[mode=' + modeNum + ']').addClass('selected');
}

function playBoxInit() {
	$('.playbox .play').click(function() {
		var $this = $(this);
		if ($this.hasClass('play')) {
			if (pauseFlag === 0) {
				$('#music_list li:first').trigger('click');
			} else {
				bufferSourceNow = createBufferSource(arraybuffer);
				bufferSourceNow && bufferSourceNow[bufferSourceNow.start?'start':'noteOn'](0,playedTime);
				pauseFlag = 0;
				startCurrentTime = ac.currentTime;
				bufferSourceNow.onended = bufferSourceEnded;
				$(this).removeClass('play').addClass('pause');
			}
		} else {
			pauseFlag = 1;
			arraybuffer = bufferSourceNow.buffer;
			bufferSourceNow && bufferSourceNow[bufferSourceNow.stop?'stop':'noteOff']();
			playedTime += ac.currentTime - startCurrentTime;
		}
	});
}

function ctrlboxInit() {
	$('.ctrlbox .next').click(nextMusic);
	$('.ctrlbox .pre').click(preMusic);
	$('#volumelab label').click(function(){
		var $volume = $('#volume');
		if (volTemp && $volume.val() == 0) {
			$volume.val(volTemp);
			volumeChange();
			volTemp = null;
			return;
		}
		volTemp = $volume.val();
		$volume.val(0);
		volumeChange();
	});

}

function infoInit() {
	$('#infobtn').click(function(){
		var $this = $(this);
		var $infobox = $('#infobox');
		if ($this.hasClass('selected')) {
			$infobox.fadeOut();
			$this.removeClass('selected');
		} else {
			$infobox.fadeIn();
			$this.addClass('selected');
		}
	});
	$('#infobox .closebtn').click(function(){
		$("#infobtn").trigger('click');
	});
}

function initAPI() {
	arr = new Uint8Array(number);
	box = document.getElementById('box');
	canvas = document.createElement('canvas');
	box.appendChild(canvas);
	ctx = canvas.getContext('2d');
	gainNode.connect(ac.destination);
	analyser.connect(gainNode);
	analyser.fftSize = number * 2;
}

function startApp() {
	music_listInit();
	volumeInit();
	mode_listInit();
	playBoxInit();
	ctrlboxInit();
	visualizer();
	resize();
	createDots();
	infoInit();
	changeMode(modeNum);
	lrcP = $('#lrcwarp .lrc')[0];
	loadNext();
}

function init() {
	initAPI();
	startApp();
	$('#infobtn').trigger('click');
};

$(document).ready(init);