var expect = require("expect.js");

var server = require("../test-lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("../..").PlexControl;

describe("Playback", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_HOST);
	});

	it("module exposes playback object", function() {
		expect(control.playback).to.be.an('object');
	});

	it("play() should request /system/players/<IP>/playback/play", function() {
		return control.playback.play().then(function() {
			assertRequested("play");
		});
	});

	it("pause() should request /system/players/<IP>/playback/pause", function() {
		return control.playback.pause().then(function() {
			assertRequested("pause");
		});
	});

	it("stop() should request /system/players/<IP>/playback/stop", function() {
		return control.playback.stop().then(function() {
			assertRequested("stop");
		});
	});

	it("rewind() should request /system/players/<IP>/playback/rewind", function() {
		return control.playback.rewind().then(function() {
			assertRequested("rewind");
		});
	});

	it("fastForward() should request /system/players/<IP>/playback/fastForward", function() {
		return control.playback.fastForward().then(function() {
			assertRequested("fastForward");
		});
	});

	it("stepForward() should request /system/players/<IP>/playback/stepForward", function() {
		return control.playback.stepForward().then(function() {
			assertRequested("stepForward");
		});
	});

	it("bigStepForward() should request /system/players/<IP>/playback/bigStepForward", function() {
		return control.playback.bigStepForward().then(function() {
			assertRequested("bigStepForward");
		});
	});

	it("stepBack() should request /system/players/<IP>/playback/stepBack", function() {
		return control.playback.stepBack().then(function() {
			assertRequested("stepBack");
		});
	});

	it("bigStepBack() should request /system/players/<IP>/playback/bigStepBack", function() {
		return control.playback.bigStepBack().then(function() {
			assertRequested("bigStepBack");
		});
	});

	it("skipNext() should request /system/players/<IP>/playback/skipNext", function() {
		return control.playback.skipNext().then(function() {
			assertRequested("skipNext");
		});
	});

	it("skipPrevious() should request /system/players/<IP>/playback/skipPrevious", function() {
		return control.playback.skipPrevious().then(function() {
			assertRequested("skipPrevious");
		});
	});

	function assertRequested(relativeUri) {
		expect(server.uri("/system/players/"+CLIENT_HOST+"/playback/" + relativeUri).requested).to.be(true);
	}

});