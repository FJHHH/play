function Musicvi_fjh(obj) {
	this.number = obj.number || 32;
	this.mouserwheelSize = obj.mouserwheelSize || 2;
	this.wp = obj.wp || 0.8;
	this.modeNum = obj.modeNum || 1;

	this.dotsH = obj.dotsH || 10;
	this.dotsNum = obj.dotsNum || 0;

	this.ballMaxSpeed = obj.ballMaxSpeed || 5;

	this.localMusic = obj.localMusic || 1;//是否使用服务器的资源
	this.filelist = [];
	this.currentTime = 0;

	this.pauseFlag = 0;
	this.arrBuffer = null;

	this.ac = null;
	this.gainNode = null;
	this.analyser = null;
	this.requestAnimationFrame = null;

	this.xhr = null;

	this.canvas = null;
	this.ctx = null;
	this.box, this.width, this.height, this.w;
	this.drawMode = null;
	this.linearGradient = null;
	this.arr = null;
}

Musicvi_fjh.prototype = {
	init:function() {
		this._prepareAPI();

	},
	_prepareAPI: function() {
		window.AudioContext = window.AudioContext || window.webkitAudioContext || window.mozAudioContext || window.msAudioContext;
		this.requestAnimationFrame = window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.msRequestAnimationFrame;
		try {
			this.ac = new window.AudioContext();
		} catch(e) {
			alert('你的浏览器可能不支持Web Audio API，建议试试最新的chrome或者firefox');
		}
	},
	_startApp: function() {
		var musiclist = $('#music_list li');
		this.arr = new Uint8Array(this.number);

	},
	_load: function(url,fun) {
		var xhr = this.xhr;
		xhr && xhr.abort();
		xhr.open('GET', url);
		xhr.responseType = 'arraybuffer';
		
	}

}