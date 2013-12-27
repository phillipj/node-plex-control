# plex-control [![Build Status](https://api.travis-ci.org/phillipj/node-plex-control.png)](http://travis-ci.org/phillipj/node-plex-control)

Node module used to control Plex clients. Utilises the Plex Media Server HTTP API/Control.

## Usage

```js
var PlexControl = require("plex-control").PlexControl;

// having Plex Media Server on 192.168.0.1
// and client wanting to control with hostname "mac-mini"
var control = new PlexControl("192.168.0.1", "mac-mini");

// ..or assigning client by IP address
control = new PlexControl("192.168.0.1", "192.168.0.2");
```

### Commands

The commands are pretty much self describing and identical to what the HTTP API offers.

**Navigation**
```js
control.navigation.moveUp();
control.navigation.moveDown();
control.navigation.moveLeft();
control.navigation.moveRight();
control.navigation.pageUp();
control.navigation.pageDown();
control.navigation.nextLetter();
control.navigation.previousLetter();
control.navigation.select();
control.navigation.back();
control.navigation.contextMenu();
control.navigation.toggleOSD();
```

**Playback**
```js
control.playback.play();
control.playback.pause();
control.playback.stop();
control.playback.rewind();
control.playback.fastForward();
control.playback.stepForward();
control.playback.bigStepForward();
control.playback.stepBack();
control.playback.bigStepBack();
control.playback.skipNext();
control.playback.skipPrevious();
```

**Promise based**

Each command returns a promise which gets resolved when command was delivered successfully by the Plex API or rejected when any error occured.
```js
control.navigation.moveUp().then(function(){
	// moveUp was successfully communicated to Plex
}, function(err){
	console.err('Error while communicating with HTTP API', err);
});
```

## Changelog

### v0.2.0
- Converted all methods to be promise based, rather than callbacks

## License
(The MIT License)

Copyright (c) 2013 Phillip Johnsen &lt;phillip@lightweight.no&gt;

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
