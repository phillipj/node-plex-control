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

The commands are pretty much self describing and identical to what the HTTP API offers. Each command will invoke given callback with an **error**-argument signaling any errors which may have occured when communicating with the HTTP API.

**Navigation**
```js
control.navigation.moveUp(callback);
control.navigation.moveDown(callback);
control.navigation.moveLeft(callback);
control.navigation.moveRight(callback);
control.navigation.pageUp(callback);
control.navigation.pageDown(callback);
control.navigation.nextLetter(callback);
control.navigation.previousLetter(callback);
control.navigation.select(callback);
control.navigation.back(callback);
control.navigation.contextMenu(callback);
control.navigation.toggleOSD(callback);
```

**Playback**
```js
control.playback.play(callback);
control.playback.pause(callback);
control.playback.stop(callback);
control.playback.rewind(callback);
control.playback.fastForward(callback);
control.playback.stepForward(callback);
control.playback.bigStepForward(callback);
control.playback.stepBack(callback);
control.playback.bigStepBack(callback);
control.playback.skipNext(callback);
control.playback.skipPrevious(callback);
```

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
