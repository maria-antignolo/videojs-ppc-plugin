import videojs from 'video.js';

// Default options for the plugin.
const defaults = {};

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
const onPlayerReady = (player, options) => {
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
const ppcPlugin = function(options) {
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
videojs.plugin('ppcPlugin', ppcPlugin);

// Include the version number.
ppcPlugin.VERSION = '__VERSION__';

export default ppcPlugin;
