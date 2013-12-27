var expect = require("expect.js");
var server = require("../lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("../..").PlexControl;

function assertRequested(relativeUri) {
	expect(server.uri("/system/players/"+CLIENT_HOST+"/navigation/" + relativeUri).requested).to.be(true);
}

describe("Navigation", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_HOST);
		server.start();
	});

	after(function(done) {
		server.stop(done);
	});

	it("module exposes navigation object", function() {
		expect(control.navigation).to.be.an('object');
	});

	it("moveUp() should request /system/players/<IP>/navigation/moveUp", function(done) {
		control.navigation.moveUp().then(function() {
			assertRequested("moveUp");
			done();
		});
	});

	it("moveDown() should request /system/players/<IP>/navigation/moveDown", function(done) {
		control.navigation.moveDown().then(function() {
			assertRequested("moveDown");
			done();
		});
	});

	it("moveLeft() should request /system/players/<IP>/navigation/moveLeft", function(done) {
		control.navigation.moveLeft().then(function() {
			assertRequested("moveLeft");
			done();
		});
	});

	it("moveRight() should request /system/players/<IP>/navigation/moveRight", function(done) {
		control.navigation.moveRight().then(function() {
			assertRequested("moveRight");
			done();
		});
	});

	it("pageUp() should request /system/players/<IP>/navigation/pageUp", function(done) {
		control.navigation.pageUp().then(function() {
			assertRequested("pageUp");
			done();
		});
	});

	it("pageDown() should request /system/players/<IP>/navigation/pageDown", function(done) {
		control.navigation.pageDown().then(function() {
			assertRequested("pageDown");
			done();
		});
	});

	it("nextLetter() should request /system/players/<IP>/navigation/nextLetter", function(done) {
		control.navigation.nextLetter().then(function() {
			assertRequested("nextLetter");
			done();
		});
	});

	it("previousLetter() should request /system/players/<IP>/navigation/previousLetter", function(done) {
		control.navigation.previousLetter().then(function() {
			assertRequested("previousLetter");
			done();
		});
	});

	it("select() should request /system/players/<IP>/navigation/select", function(done) {
		control.navigation.select().then(function() {
			assertRequested("select");
			done();
		});
	});

	it("back() should request /system/players/<IP>/navigation/back", function(done) {
		control.navigation.back().then(function() {
			assertRequested("back");
			done();
		});
	});

	it("contextMenu() should request /system/players/<IP>/navigation/contextMenu", function(done) {
		control.navigation.contextMenu().then(function() {
			assertRequested("contextMenu");
			done();
		});
	});

	it("toggleOSD() should request /system/players/<IP>/navigation/toggleOSD", function(done) {
		control.navigation.toggleOSD().then(function() {
			assertRequested("toggleOSD");
			done();
		});
	});
});