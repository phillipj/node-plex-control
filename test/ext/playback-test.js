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
		control.playback.play().then(function() {
			assertRequested("play");
			done();
		});
	});

	it("pause() should request /system/players/<IP>/playback/pause", function(done) {
		control.playback.pause().then(function() {
			assertRequested("pause");
			done();
		});
	});

	it("stop() should request /system/players/<IP>/playback/stop", function(done) {
		control.playback.stop().then(function() {
			assertRequested("stop");
			done();
		});
	});

	it("rewind() should request /system/players/<IP>/playback/rewind", function(done) {
		control.playback.rewind().then(function() {
			assertRequested("rewind");
			done();
		});
	});

	it("fastForward() should request /system/players/<IP>/playback/fastForward", function(done) {
		control.playback.fastForward().then(function() {
			assertRequested("fastForward");
			done();
		});
	});

	it("stepForward() should request /system/players/<IP>/playback/stepForward", function(done) {
		control.playback.stepForward().then(function() {
			assertRequested("stepForward");
			done();
		});
	});

	it("bigStepForward() should request /system/players/<IP>/playback/bigStepForward", function(done) {
		control.playback.bigStepForward().then(function() {
			assertRequested("bigStepForward");
			done();
		});
	});

	it("stepBack() should request /system/players/<IP>/playback/stepBack", function(done) {
		control.playback.stepBack().then(function() {
			assertRequested("stepBack");
			done();
		});
	});

	it("bigStepBack() should request /system/players/<IP>/playback/bigStepBack", function(done) {
		control.playback.bigStepBack().then(function() {
			assertRequested("bigStepBack");
			done();
		});
	});

	it("skipNext() should request /system/players/<IP>/playback/skipNext", function(done) {
		control.playback.skipNext().then(function() {
			assertRequested("skipNext");
			done();
		});
	});

	it("skipPrevious() should request /system/players/<IP>/playback/skipPrevious", function(done) {
		control.playback.skipPrevious().then(function() {
			assertRequested("skipPrevious");
			done();
		});
	});
});