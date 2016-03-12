(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.videojsPpcPlugin = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
(function (global){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { 'default': obj }; }

var _videoJs = (typeof window !== "undefined" ? window['videojs'] : typeof global !== "undefined" ? global['videojs'] : null);

var _videoJs2 = _interopRequireDefault(_videoJs);

// Default options for the plugin.
var defaults = {};

/**
 * Function to invoke when the player is ready.
 *
 * This is a great place for your plugin to initialize itself. When this
 * function is called, the player will have its DOM and child components
 * in place.
 *
 * @function onPlayerReady
 * @param    {Player} player
 * @param    {Object} [options={}]
 */
var onPlayerReady = function onPlayerReady(player, options) {
	player.addClass('vjs-ppc-plugin');
};

/**
 * A video.js plugin.
 *
 * In the plugin function, the value of `this` is a video.js `Player`
 * instance. You cannot rely on the player being in a "ready" state here,
 * depending on how the plugin is invoked. This may or may not be important
 * to you; if not, remove the wait for "ready"!
 *
 * @function ppcPlugin
 * @param    {Object} [options={}]
 *           An object of options left to the plugin author to define.
 */
var ppcPlugin = function ppcPlugin(options) {
	var _p = this;
	var _f = null;
	var playcount = 0;
	var pausecount = 0;
	var pauseTime = null;
	var playTime = null;
	var timePaused = null;
	var elapsedString = '';
	var totalElapsed = null;

	_p._v = {
		val: {
			'real': ''
		},

		init: function init() {
			_p.one('play', _videoJs2['default'].bind(this, this.play));
			_p.one('ended', _videoJs2['default'].bind(this, this.log));
		},

		play: function play() {
			_f = _videoJs2['default'].bind(this, this.set);
			setTimeout(function () {
				_p.one('timeupdate', _f);
			}, 2000);
			_p.on('play', function () {
				var playTime = new Date().getTime();

				if (_p.currentTime() > 0) {
					if (pauseTime) {
						timePaused = playTime - pauseTime;totalElapsed += timePaused;
					}

					var http = new XMLHttpRequest();
					var url = "http://jsonplaceholder.typicode.com/posts";
					var params = "resumedVideo=" + _p.currentSrc();
					http.open("POST", url, true);
					http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

					http.onreadystatechange = function () {
						if (http.readyState == 4 && http.status == 200) {
							console.log('houston...got an error here!');
						}
					};

					http.send(params);

					if (timePaused) {
						var elapsedString = "after " + timePaused + ' miliseconds paused.';
					}

					var resumeparagraph = document.createElement("p");
					var resumetext = document.createTextNode("The video was resumed " + elapsedString);
					resumeparagraph.appendChild(resumetext);
					document.getElementById("actions").appendChild(resumeparagraph);
					playcount++;
					document.getElementById("playCounter").innerHTML = playcount;
				} else {
					var http = new XMLHttpRequest();
					var url = "http://jsonplaceholder.typicode.com/posts";
					var params = "startedVideo=" + _p.currentSrc();
					http.open("POST", url, true);
					http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

					http.onreadystatechange = function () {
						if (http.readyState == 4 && http.status == 200) {
							console.log('houston...got an error here!');
						}
					};
					http.send(params);

					var startText = document.createTextNode("Video started.");
					document.getElementById("start").appendChild(startText);
				}
			});

			_p.on('pause', function () {
				pauseTime = new Date().getTime();
				console.log('paused at:' + pauseTime);
				pausecount++;
				document.getElementById("pauseCounter").innerHTML = pausecount;
			});
		},

		set: function set() {
			this.val.real = _p.currentSrc();
			_p.load();
			_p.play();
			_p.one('ended', _videoJs2['default'].bind(this, this.unset));
		},

		unset: function unset() {
			_p.src(this.val.real);
			_p.load();
			_p.one('ended', _videoJs2['default'].bind(this, this.log));
		},

		log: function log() {
			console.log('ended:' + _p.currentSrc());
			var endText = document.createTextNode("The video is finished. It was paused during " + totalElapsed + "miliseconds.");
			document.getElementById("end").appendChild(endText);
			var http = new XMLHttpRequest();
			var url = "http://jsonplaceholder.typicode.com/posts";
			var params = "endvideo=" + _p.currentSrc() + "&playccount=" + playcount + "&pausecount=" + pausecount;
			http.open("POST", url, true);
			http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

			http.onreadystatechange = function () {
				if (http.readyState == 4 && http.status == 200) {
					console.log('houston...got an error here!');
				}
			};
			http.send(params);
		}
	};

	_p.ready(function () {
		_p._v.init();
	});
};

// Register the plugin with video.js.
_videoJs2['default'].plugin('ppcPlugin', ppcPlugin);

// Include the version number.
ppcPlugin.VERSION = '0.0.0';

exports['default'] = ppcPlugin;
module.exports = exports['default'];

}).call(this,typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})

},{}]},{},[1])(1)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJFOi93ZWJwYWdlcy92aWRlb2pzLXBwYy1wbHVnaW4vc3JjL3BsdWdpbi5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7Ozs7Ozs7Ozt1QkNBb0IsVUFBVTs7Ozs7QUFHOUIsSUFBTSxRQUFRLEdBQUcsRUFBRSxDQUFDOzs7Ozs7Ozs7Ozs7O0FBYXBCLElBQU0sYUFBYSxHQUFHLFNBQWhCLGFBQWEsQ0FBSSxNQUFNLEVBQUUsT0FBTyxFQUFLO0FBQ3pDLE9BQU0sQ0FBQyxRQUFRLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztDQUNuQyxDQUFDOzs7Ozs7Ozs7Ozs7OztBQWNGLElBQU0sU0FBUyxHQUFHLFNBQVosU0FBUyxDQUFZLE9BQU8sRUFBRTtBQUNuQyxLQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZCxLQUFJLEVBQUUsR0FBRyxJQUFJLENBQUM7QUFDZCxLQUFJLFNBQVMsR0FBRyxDQUFDLENBQUM7QUFDbEIsS0FBSSxVQUFVLEdBQUcsQ0FBQyxDQUFDO0FBQ25CLEtBQUksU0FBUyxHQUFHLElBQUksQ0FBQztBQUNyQixLQUFJLFFBQVEsR0FBRyxJQUFJLENBQUM7QUFDcEIsS0FBSSxVQUFVLEdBQUcsSUFBSSxDQUFDO0FBQ3RCLEtBQUksYUFBYSxHQUFHLEVBQUUsQ0FBQztBQUN2QixLQUFJLFlBQVksR0FBRyxJQUFJLENBQUM7O0FBRXhCLEdBQUUsQ0FBQyxFQUFFLEdBQUc7QUFDSixLQUFHLEVBQUc7QUFDTixTQUFNLEVBQUUsRUFBRTtHQUNUOztBQUVELE1BQUksRUFBRyxnQkFBWTtBQUNuQixLQUFFLENBQUMsR0FBRyxDQUFDLE1BQU0sRUFBRSxxQkFBUSxJQUFJLENBQUMsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDO0FBQzlDLEtBQUUsQ0FBQyxHQUFHLENBQUMsT0FBTyxFQUFFLHFCQUFRLElBQUksQ0FBQyxJQUFJLEVBQUUsSUFB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Y3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCB2aWRlb2pzIGZyb20gJ3ZpZGVvLmpzJztcblxuLy8gRGVmYXVsdCBvcHRpb25zIGZvciB0aGUgcGx1Z2luLlxuY29uc3QgZGVmYXVsdHMgPSB7fTtcblxuLyoqXG4gKiBGdW5jdGlvbiB0byBpbnZva2Ugd2hlbiB0aGUgcGxheWVyIGlzIHJlYWR5LlxuICpcbiAqIFRoaXMgaXMgYSBncmVhdCBwbGFjZSBmb3IgeW91ciBwbHVnaW4gdG8gaW5pdGlhbGl6ZSBpdHNlbGYuIFdoZW4gdGhpc1xuICogZnVuY3Rpb24gaXMgY2FsbGVkLCB0aGUgcGxheWVyIHdpbGwgaGF2ZSBpdHMgRE9NIGFuZCBjaGlsZCBjb21wb25lbnRzXG4gKiBpbiBwbGFjZS5cbiAqXG4gKiBAZnVuY3Rpb24gb25QbGF5ZXJSZWFkeVxuICogQHBhcmFtICAgIHtQbGF5ZXJ9IHBsYXllclxuICogQHBhcmFtICAgIHtPYmplY3R9IFtvcHRpb25zPXt9XVxuICovXG5jb25zdCBvblBsYXllclJlYWR5ID0gKHBsYXllciwgb3B0aW9ucykgPT4ge1xuICBwbGF5ZXIuYWRkQ2xhc3MoJ3Zqcy1wcGMtcGx1Z2luJyk7XG59O1xuXG4vKipcbiAqIEEgdmlkZW8uanMgcGx1Z2luLlxuICpcbiAqIEluIHRoZSBwbHVnaW4gZnVuY3Rpb24sIHRoZSB2YWx1ZSBvZiBgdGhpc2AgaXMgYSB2aWRlby5qcyBgUGxheWVyYFxuICogaW5zdGFuY2UuIFlvdSBjYW5ub3QgcmVseSBvbiB0aGUgcGxheWVyIGJlaW5nIGluIGEgXCJyZWFkeVwiIHN0YXRlIGhlcmUsXG4gKiBkZXBlbmRpbmcgb24gaG93IHRoZSBwbHVnaW4gaXMgaW52b2tlZC4gVGhpcyBtYXkgb3IgbWF5IG5vdCBiZSBpbXBvcnRhbnRcbiAqIHRvIHlvdTsgaWYgbm90LCByZW1vdmUgdGhlIHdhaXQgZm9yIFwicmVhZHlcIiFcbiAqXG4gKiBAZnVuY3Rpb24gcHBjUGx1Z2luXG4gKiBAcGFyYW0gICAge09iamVjdH0gW29wdGlvbnM9e31dXG4gKiAgICAgICAgICAgQW4gb2JqZWN0IG9mIG9wdGlvbnMgbGVmdCB0byB0aGUgcGx1Z2luIGF1dGhvciB0byBkZWZpbmUuXG4gKi9cbmNvbnN0IHBwY1BsdWdpbiA9IGZ1bmN0aW9uKG9wdGlvbnMpIHtcblx0dmFyIF9wID0gdGhpcztcblx0dmFyIF9mID0gbnVsbDtcblx0dmFyIHBsYXljb3VudCA9IDA7XG5cdHZhciBwYXVzZWNvdW50ID0gMDtcblx0dmFyIHBhdXNlVGltZSA9IG51bGw7XG5cdHZhciBwbGF5VGltZSA9IG51bGw7XG5cdHZhciB0aW1lUGF1c2VkID0gbnVsbDtcblx0dmFyIGVsYXBzZWRTdHJpbmcgPSAnJztcblx0dmFyIHRvdGFsRWxhcHNlZCA9IG51bGw7XG5cblx0X3AuX3YgPSB7XG5cdCAgICB2YWwgOiB7XG5cdCAgICAncmVhbCc6ICcnXG5cdCAgICB9LFxuXG5cdCAgICBpbml0IDogZnVuY3Rpb24gKCkge1xuXHQgICAgX3Aub25lKCdwbGF5JywgdmlkZW9qcy5iaW5kKHRoaXMsIHRoaXMucGxheSkpO1xuXHQgICAgX3Aub25lKCdlbmRlZCcsIHZpZGVvanMuYmluZCh0aGlzLCB0aGlzLmxvZykpO1xuXHQgICAgfSxcblxuXHQgICAgcGxheSA6IGZ1bmN0aW9uKCkge1xuXHRcdCAgICBfZiA9IHZpZGVvanMuYmluZCh0aGlzLCB0aGlzLnNldCk7XG5cdFx0ICAgIHNldFRpbWVvdXQoIGZ1bmN0aW9uKCkge19wLm9uZSgndGltZXVwZGF0ZScsIF9mKTt9ICwgMjAwMCk7XG5cdFx0ICAgIF9wLm9uKCdwbGF5JywgZnVuY3Rpb24oKSB7XG5cdFx0ICAgIFx0dmFyIHBsYXlUaW1lID0gKG5ldyBEYXRlKCkpLmdldFRpbWUoKTtcblxuXHRcdCAgICBcdGlmKCBfcC5jdXJyZW50VGltZSgpID4gMCl7XG5cdFx0ICAgIFx0XHRpZiAocGF1c2VUaW1lKXsgdGltZVBhdXNlZCA9IHBsYXlUaW1lIC0gcGF1c2VUaW1lOyB0b3RhbEVsYXBzZWQrPXRpbWVQYXVzZWQ7fVxuXG5cdFx0ICAgIFx0XHR2YXIgaHR0cCA9IG5ldyBYTUxIdHRwUmVxdWVzdCgpO1xuXHRcdFx0XHRcdHZhciB1cmwgPSBcImh0dHA6Ly9qc29ucGxhY2Vob2xkZXIudHlwaWNvZGUuY29tL3Bvc3RzXCI7XG5cdFx0XHRcdFx0dmFyIHBhcmFtcyA9IFwicmVzdW1lZFZpZGVvPVwiICsgX3AuY3VycmVudFNyYygpO1xuXHRcdFx0XHRcdGh0dHAub3BlbihcIlBPU1RcIiwgdXJsLCB0cnVlKTtcblx0XHRcdFx0XHRodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XG5cblx0XHRcdFx0XHRodHRwLm9ucmVhZHlzdGF0ZWNoYW5nZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0XHRcdCAgICBpZihodHRwLnJlYWR5U3RhdGUgPT0gNCAmJiBodHRwLnN0YXR1cyA9PSAyMDApIHtcblx0XHRcdFx0XHQgICAgICAgY29uc29sZS5sb2coJ2hvdXN0b24uLi5nb3QgYW4gZXJyb3IgaGVyZSEnKTtcblx0XHRcdFx0XHQgICAgfVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0XHRcblx0XHRcdFx0XHRodHRwLnNlbmQocGFyYW1zKTtcblxuXHRcdFx0XHRcdGlmKHRpbWVQYXVzZWQpeyBcblx0XHRcdFx0XHRcdHZhciBlbGFwc2VkU3RyaW5nID0gXCJhZnRlciBcIiArIHRpbWVQYXVzZWQgKyAnIG1pbGlzZWNvbmRzIHBhdXNlZC4nO1xuXHRcdFx0ICAgIFx0fVxuXG5cdFx0XHRcdFx0dmFyIHJlc3VtZXBhcmFncmFwaCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJwXCIpO1xuXHRcdFx0XHRcdHZhciByZXN1bWV0ZXh0ID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoXCJUaGUgdmlkZW8gd2FzIHJlc3VtZWQgXCIgKyBlbGFwc2VkU3RyaW5nKTtcblx0XHRcdFx0XHRyZXN1bWVwYXJhZ3JhcGguYXBwZW5kQ2hpbGQocmVzdW1ldGV4dCk7XG5cdFx0XHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJhY3Rpb25zXCIpLmFwcGVuZENoaWxkKHJlc3VtZXBhcmFncmFwaCk7XG5cdFx0XHRcdFx0cGxheWNvdW50Kys7XG5cdFx0ICAgIFx0XHRkb2N1bWVudC5nZXRFbGVtZW50QnlJZChcInBsYXlDb3VudGVyXCIpLmlubmVySFRNTCA9IHBsYXljb3VudDtcblx0XHQgICAgXHR9ZWxzZXtcblx0XHQgICAgXHRcdHZhciBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHRcdFx0dmFyIHVybCA9IFwiaHR0cDovL2pzb25wbGFjZWhvbGRlci50eXBpY29kZS5jb20vcG9zdHNcIjtcblx0XHRcdFx0XHR2YXIgcGFyYW1zID0gXCJzdGFydGVkVmlkZW89XCIgKyBfcC5jdXJyZW50U3JjKCk7XG5cdFx0XHRcdFx0aHR0cC5vcGVuKFwiUE9TVFwiLCB1cmwsIHRydWUpO1xuXHRcdFx0XHRcdGh0dHAuc2V0UmVxdWVzdEhlYWRlcihcIkNvbnRlbnQtdHlwZVwiLCBcImFwcGxpY2F0aW9uL3gtd3d3LWZvcm0tdXJsZW5jb2RlZFwiKTtcblxuXHRcdFx0XHRcdGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRcdFx0ICAgIGlmKGh0dHAucmVhZHlTdGF0ZSA9PSA0ICYmIGh0dHAuc3RhdHVzID09IDIwMCkge1xuXHRcdFx0XHRcdCAgICAgICBjb25zb2xlLmxvZygnaG91c3Rvbi4uLmdvdCBhbiBlcnJvciBoZXJlIScpO1xuXHRcdFx0XHRcdCAgICB9XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHRcdGh0dHAuc2VuZChwYXJhbXMpO1xuXHRcdFx0XHRcdFxuXHRcdFx0XHRcdHZhciBzdGFydFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlZpZGVvIHN0YXJ0ZWQuXCIpO1xuXHRcdFx0XHRcdGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwic3RhcnRcIikuYXBwZW5kQ2hpbGQoc3RhcnRUZXh0KTtcblx0XHQgICAgXHR9XG5cdFx0ICAgIH0pO1xuXG5cdFx0ICAgIF9wLm9uKCdwYXVzZScsIGZ1bmN0aW9uKCkge1xuXHRcdFx0ICAgIHBhdXNlVGltZSA9IChuZXcgRGF0ZSgpKS5nZXRUaW1lKCk7XG5cdFx0ICAgIFx0Y29uc29sZS5sb2coJ3BhdXNlZCBhdDonICsgcGF1c2VUaW1lKTtcblx0XHQgICAgXHRwYXVzZWNvdW50Kys7XG5cdFx0ICAgIFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJwYXVzZUNvdW50ZXJcIikuaW5uZXJIVE1MID0gcGF1c2Vjb3VudDtcblx0ICAgIFx0fSk7XG5cdCAgICB9LFxuXG5cdCAgICBzZXQgOiBmdW5jdGlvbiAoKSB7XG5cdFx0ICAgIHRoaXMudmFsLnJlYWwgPSBfcC5jdXJyZW50U3JjKCk7XG5cdFx0ICAgIF9wLmxvYWQoKTtcblx0XHQgICAgX3AucGxheSgpO1xuXHRcdCAgICBfcC5vbmUoJ2VuZGVkJywgdmlkZW9qcy5iaW5kKHRoaXMsIHRoaXMudW5zZXQpKTtcblx0ICAgIH0sXG5cblx0ICAgIHVuc2V0OiBmdW5jdGlvbigpIHtcblx0XHQgICAgX3Auc3JjKHRoaXMudmFsLnJlYWwpO1xuXHRcdCAgICBfcC5sb2FkKCk7XG5cdFx0ICAgIF9wLm9uZSgnZW5kZWQnLCB2aWRlb2pzLmJpbmQodGhpcywgdGhpcy5sb2cpKTtcblx0ICAgIH0sXG5cblx0ICAgIGxvZzogIGZ1bmN0aW9uKCkge1xuXHRcdCAgICBjb25zb2xlLmxvZyggJ2VuZGVkOicgKyBfcC5jdXJyZW50U3JjKCkgKTtcblx0XHQgICAgdmFyIGVuZFRleHQgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShcIlRoZSB2aWRlbyBpcyBmaW5pc2hlZC4gSXQgd2FzIHBhdXNlZCBkdXJpbmcgXCIrIHRvdGFsRWxhcHNlZCArIFwibWlsaXNlY29uZHMuXCIpO1xuXHRcdFx0ZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoXCJlbmRcIikuYXBwZW5kQ2hpbGQoZW5kVGV4dCk7XG5cdFx0ICAgIHZhciBodHRwID0gbmV3IFhNTEh0dHBSZXF1ZXN0KCk7XG5cdFx0XHR2YXIgdXJsID0gXCJodHRwOi8vanNvbnBsYWNlaG9sZGVyLnR5cGljb2RlLmNvbS9wb3N0c1wiO1xuXHRcdFx0dmFyIHBhcmFtcyA9IFwiZW5kdmlkZW89XCIgKyBfcC5jdXJyZW50U3JjKCkgKyBcIiZwbGF5Y2NvdW50PVwiICsgcGxheWNvdW50ICsgXCImcGF1c2Vjb3VudD1cIiArIHBhdXNlY291bnQ7XG5cdFx0XHRodHRwLm9wZW4oXCJQT1NUXCIsIHVybCwgdHJ1ZSk7XG5cdFx0XHRodHRwLnNldFJlcXVlc3RIZWFkZXIoXCJDb250ZW50LXR5cGVcIiwgXCJhcHBsaWNhdGlvbi94LXd3dy1mb3JtLXVybGVuY29kZWRcIik7XG5cblx0XHRcdGh0dHAub25yZWFkeXN0YXRlY2hhbmdlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHQgICAgaWYoaHR0cC5yZWFkeVN0YXRlID09IDQgJiYgaHR0cC5zdGF0dXMgPT0gMjAwKSB7XG5cdFx0XHQgICAgICAgY29uc29sZS5sb2coJ2hvdXN0b24uLi5nb3QgYW4gZXJyb3IgaGVyZSEnKTtcblx0XHRcdCAgICB9XG5cdFx0XHR9XG5cdFx0XHRodHRwLnNlbmQocGFyYW1zKTtcblx0ICAgIH1cblx0fTtcblxuXHRfcC5yZWFkeSggZnVuY3Rpb24gKCkgeyBfcC5fdi5pbml0KCkgfSApO1xufTtcblxuLy8gUmVnaXN0ZXIgdGhlIHBsdWdpbiB3aXRoIHZpZGVvLmpzLlxudmlkZW9qcy5wbHVnaW4oJ3BwY1BsdWdpbicsIHBwY1BsdWdpbik7XG5cbi8vIEluY2x1ZGUgdGhlIHZlcnNpb24gbnVtYmVyLlxucHBjUGx1Z2luLlZFUlNJT04gPSAnX19WRVJTSU9OX18nO1xuXG5leHBvcnQgZGVmYXVsdCBwcGNQbHVnaW47XG4iXX0=
