/**
 * videojs-ppc-plugin
 * @version 0.0.0
 * @copyright 2016 María Antignolo
 * @license Apache-2.0
 */
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
    val : {
    'real': ''
    },

    init : function () {
    _p.one('play', videojs.bind(this, this.play));
    _p.one('ended', videojs.bind(this, this.log));
    },

    play : function() {
	    _f = videojs.bind(this, this.set);
	    setTimeout( function() {_p.one('timeupdate', _f);} , 2000);
	    _p.on('play', function() {
	    	var playTime = (new Date()).getTime();

	    	if( _p.currentTime() > 0){
	    		if (pauseTime){ timePaused = playTime - pauseTime; totalElapsed+=timePaused;}

	    		var http = new XMLHttpRequest();
				var url = "http://jsonplaceholder.typicode.com/posts";
				var params = "resumedVideo=" + _p.currentSrc();
				http.open("POST", url, true);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				http.onreadystatechange = function() {
				    if(http.readyState == 4 && http.status == 200) {
				       console.log('houston...got an error here!');
				    }
				}
				http.send(params);

				if(timePaused){ 
					var elapsedString = "after " + timePaused + ' miliseconds paused.';
		    	}

				var resumeparagraph = document.createElement("p");
				var resumetext = document.createTextNode("The video was resumed " + elapsedString);
				resumeparagraph.appendChild(resumetext);
				document.getElementById("actions").appendChild(resumeparagraph);
				playcount++;
	    		document.getElementById("playCounter").innerHTML = playcount;
	    	}else{
	    		var http = new XMLHttpRequest();
				var url = "http://jsonplaceholder.typicode.com/posts";
				var params = "startedVideo=" + _p.currentSrc();
				http.open("POST", url, true);
				http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

				http.onreadystatechange = function() {
				    if(http.readyState == 4 && http.status == 200) {
				       console.log('houston...got an error here!');
				    }
				}
				http.send(params);
				
				var startText = document.createTextNode("Video started.");
				document.getElementById("start").appendChild(startText);
	    	}
	    });

	    _p.on('pause', function() {
		    pauseTime = (new Date()).getTime();
	    	console.log('paused at:' + pauseTime);
	    	pausecount++;
	    	document.getElementById("pauseCounter").innerHTML = pausecount;
    	});
    },

    set : function () {
    this.val.real = _p.currentSrc();
    _p.load();
    _p.play();
    _p.one('ended', videojs.bind(this, this.unset));
    },

    unset: function() {
    _p.src(this.val.real);
    _p.load();
    _p.one('ended', videojs.bind(this, this.log));
    },

    log:  function() {
    console.log( 'ended:' + _p.currentSrc() );
    var endText = document.createTextNode("The video is finished. It was paused during "+ totalElapsed + "miliseconds.");
	document.getElementById("end").appendChild(endText);
    var http = new XMLHttpRequest();
	var url = "http://jsonplaceholder.typicode.com/posts";
	var params = "endvideo=" + _p.currentSrc() + "&playccount=" + playcount + "&pausecount=" + pausecount;
	http.open("POST", url, true);
	http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");

	http.onreadystatechange = function() {
	    if(http.readyState == 4 && http.status == 200) {
	       console.log('houston...got an error here!');
	    }
	}
	http.send(params);
    }
};

_p.ready( function () { _p._v.init() } );
 
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