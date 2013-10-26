var buster = require("buster");
var server = require("../lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("../..").PlexControl;

function assertRequested(relativeUri) {
	assert(server.uri("/system/players/"+CLIENT_HOST+"/playback/" + relativeUri).requested);
}

buster.testCase("Playback", {
	setUp: function() {
		server.start();
		this.control = new PlexControl(SERVER_HOST, CLIENT_HOST);
	},

	tearDown: function() {
		try {
			server.stop();
		} catch (ignoredException) {}
	},

	"module exposes playback object": function() {
		assert.isObject(this.control.playback);
	},

	"play() should request /system/players/<IP>/playback/play": function(done) {
		this.control.playback.play(function(err) {
			assertRequested("play");
			done();
		});
	},

	"pause() should request /system/players/<IP>/playback/pause": function(done) {
		this.control.playback.pause(function(err) {
			assertRequested("pause");
			done();
		});
	},

	"stop() should request /system/players/<IP>/playback/stop": function(done) {
		this.control.playback.stop(function(err) {
			assertRequested("stop");
			done();
		});
	},

	"rewind() should request /system/players/<IP>/playback/rewind": function(done) {
		this.control.playback.rewind(function(err) {
			assertRequested("rewind");
			done();
		});
	},

	"fastForward() should request /system/players/<IP>/playback/fastForward": function(done) {
		this.control.playback.fastForward(function(err) {
			assertRequested("fastForward");
			done();
		});
	},

	"stepForward() should request /system/players/<IP>/playback/stepForward": function(done) {
		this.control.playback.stepForward(function(err) {
			assertRequested("stepForward");
			done();
		});
	},

	"bigStepForward() should request /system/players/<IP>/playback/bigStepForward": function(done) {
		this.control.playback.bigStepForward(function(err) {
			assertRequested("bigStepForward");
			done();
		});
	},

	"stepBack() should request /system/players/<IP>/playback/stepBack": function(done) {
		this.control.playback.stepBack(function(err) {
			assertRequested("stepBack");
			done();
		});
	},

	"bigStepBack() should request /system/players/<IP>/playback/bigStepBack": function(done) {
		this.control.playback.bigStepBack(function(err) {
			assertRequested("bigStepBack");
			done();
		});
	},

	"skipNext() should request /system/players/<IP>/playback/skipNext": function(done) {
		this.control.playback.skipNext(function(err) {
			assertRequested("skipNext");
			done();
		});
	},

	"skipPrevious() should request /system/players/<IP>/playback/skipPrevious": function(done) {
		this.control.playback.skipPrevious(function(err) {
			assertRequested("skipPrevious");
			done();
		});
	}
});