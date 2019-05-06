# plex-control [![Build Status](https://api.travis-ci.org/phillipj/node-plex-control.png)](http://travis-ci.org/phillipj/node-plex-control)

Node module used to control Plex clients. Utilises the Plex Media Server HTTP API/Control.

## Usage

**PlexControl(serverIp, clientNameOrIp[, options])**

```js
var PlexControl = require("plex-control").PlexControl;

// having Plex Media Server on 192.168.0.1
// and client wanting to control with hostname "mac-mini"
var control = new PlexControl("192.168.0.1", "mac-mini");

// ..or assigning client by IP address
control = new PlexControl("192.168.0.1", "192.168.0.2");
```

If **options** are provided they are given to the underlying [plex-api](https://www.npmjs.com/package/plex-api) upon instantiation.

### Commands

**Promise based**

Each command returns a promise which gets resolved when command was delivered successfully by the Plex API or rejected when any error occured.
```js
control.navigation.moveUp().then(function(){
	// moveUp was successfully communicated to Plex
}, function(err){
	console.err('Error while communicating with HTTP API', err);
});
```

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

**Currently**

What's currently happing on the client?

```js
control.currently.playing();
control.currently.paused();
```

It resolves to an object representing what's currently playing/paused. The object has lots of details about the given media. Hints of what's available in these gigantic detailed media representations can be found on the XML example on the [StatusSessions page in the unofficial Plex API documentation](https://code.google.com/p/plex-api/wiki/StatusSessions).

```js
control.currently.playing().then(function(result){
	if (!result) {
		console.log("Nothing is currently playing");
	} else {
		console.log("Currently playing a %s titled: %s",
			result.attributes.type,
			result.attributes.title);
	}
});

```

**getClientInfo(name | IP)**

Returns a promise containing the info about the client matched by either the name or IP-address provided. Rejects with a `NotFoundError` if client was not found.

## Changelog

### v3.0.1
- Upgraded the validator dependency from v5.x -> v10.x by @phillipj

### v3.0.0
- Upgraded the plex-api dependency from v3.x -> v5.2.2 by @phillipj

#### BREAKING CHANGES FROM v2.x

`control.api` which holds a reference to the underlying [plex-api](https://www.npmjs.com/package/plex-api) instance,
has gotten a major upgrade.

### v2.0.0
- Upgraded the plex-api dependency from v0.x -> v3.0.0 by @phillipj
- getClientInfo() might reject with NotFoundError by @phillipj

#### BREAKING CHANGES FROM v1.x

`control.api` which holds a reference to the underlying [plex-api](https://www.npmjs.com/package/plex-api) instance,
has gotten a major upgrade. Read more especially about the XML -> JSON changes done in plex-api between v1.0 and v2.0.

`getClientInfo()` rejects with a `NotFoundError` instead of resolving to an `undefined` value. To check whether or not
the error is a NotFoundError you could check `err.name === 'NotFound'` or compare the error instance against the exposed
NotFoundError constructor from this module (`require('plex-control').NotFoundError`).

### v1.0.0
- Added the .currently commands
- Major bumped when.js from v2 to v3
- Changed control.on("resolved") to provide the whole plex client object found by hostname or IP, rather than just the IP-address

### v0.2.0
- Converted all methods to be promise based, rather than callbacks

## License
(The MIT License)

Copyright (c) 2013-2014 Phillip Johnsen &lt;phillip@lightweight.no&gt;

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
