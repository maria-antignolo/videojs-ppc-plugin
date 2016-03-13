# videojs-ppc-plugin

Plugin to count pauses and resumes during a video and make an http call to register them.

## Table of Contents

<!-- START doctoc -->
<!-- END doctoc -->
## Installation  
```sh
npm install --save videojs-ppc-plugin  
``` 

## Demo
Using this couple of commands you should be set up to check the plugin working :-)

```sh
npm npm run-script build 
``` 
```sh
npm npm run-script start 
``` 
 


## Usage

To include videojs-ppc-plugin on your website or web application, use any of the following methods.

### `<script>` Tag

This is the simplest case. Get the script in whatever way you prefer and include the plugin _after_ you include [video.js][videojs], so that the `videojs` global is available.

```html
<script src="//path/to/video.min.js"></script>
<script src="//path/to/videojs-ppc-plugin.min.js"></script>
<script>
  var player = videojs('my-video');

  player.ppcPlugin();
</script>
```

### Browserify

When using with Browserify, install videojs-ppc-plugin via npm and `require` the plugin as you would any other module.

```js
var videojs = require('video.js');

// The actual plugin function is exported by this module, but it is also
// attached to the `Player.prototype`; so, there is no need to assign it
// to a variable.
require('videojs-ppc-plugin');

var player = videojs('my-video');

player.ppcPlugin();
```

### RequireJS/AMD

When using with RequireJS (or another AMD library), get the script in whatever way you prefer and `require` the plugin as you normally would:

```js
require(['video.js', 'videojs-ppc-plugin'], function(videojs) {
  var player = videojs('my-video');

  player.ppcPlugin();
});
```

## License

Apache-2.0. Copyright (c) María Antignolo


[videojs]: http://videojs.com/
