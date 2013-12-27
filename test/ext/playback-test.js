var expect = require("expect.js");
var server = require("../lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("../..").PlexControl;

function assertRequested(relativeUri) {
	expect(server.uri("/system/players/"+CLIENT_HOST+"/playback/" + relativeUri).requested).to.be(true);
}

describe("Playback", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_HOST);
		server.start();
	});

	after(function() {
		server.stop();
	});

	it("module exposes playback object", function() {
		expect(control.playback).to.be.an('object');
	});

	it("play() should request /system/players/<IP>/playback/play", function(done) {
		control.playback.play(function(err) {
			assertRequested("play");
			done();
		});
	});

	it("pause() should request /system/players/<IP>/playback/pause", function(done) {
		control.playback.pause(function(err) {
			assertRequested("pause");
			done();
		});
	});

	it("stop() should request /system/players/<IP>/playback/stop", function(done) {
		control.playback.stop(function(err) {
			assertRequested("stop");
			done();
		});
	});

	it("rewind() should request /system/players/<IP>/playback/rewind", function(done) {
		control.playback.rewind(function(err) {
			assertRequested("rewind");
			done();
		});
	});

	it("fastForward() should request /system/players/<IP>/playback/fastForward", function(done) {
		control.playback.fastForward(function(err) {
			assertRequested("fastForward");
			done();
		});
	});

	it("stepForward() should request /system/players/<IP>/playback/stepForward", function(done) {
		control.playback.stepForward(function(err) {
			assertRequested("stepForward");
			done();
		});
	});

	it("bigStepForward() should request /system/players/<IP>/playback/bigStepForward", function(done) {
		control.playback.bigStepForward(function(err) {
			assertRequested("bigStepForward");
			done();
		});
	});

	it("stepBack() should request /system/players/<IP>/playback/stepBack", function(done) {
		control.playback.stepBack(function(err) {
			assertRequested("stepBack");
			done();
		});
	});

	it("bigStepBack() should request /system/players/<IP>/playback/bigStepBack", function(done) {
		control.playback.bigStepBack(function(err) {
			assertRequested("bigStepBack");
			done();
		});
	});

	it("skipNext() should request /system/players/<IP>/playback/skipNext", function(done) {
		control.playback.skipNext(function(err) {
			assertRequested("skipNext");
			done();
		});
	});

	it("skipPrevious() should request /system/players/<IP>/playback/skipPrevious", function(done) {
		control.playback.skipPrevious(function(err) {
			assertRequested("skipPrevious");
			done();
		});
	});
});