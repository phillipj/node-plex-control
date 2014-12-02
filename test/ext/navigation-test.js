var expect = require("expect.js");

var server = require("../test-lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("../..").PlexControl;

describe("Navigation", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_HOST);
	});

	it("module exposes navigation object", function() {
		expect(control.navigation).to.be.an('object');
	});

	it("moveUp() should request /system/players/<IP>/navigation/moveUp", function() {
		return control.navigation.moveUp().then(function() {
			assertRequested("moveUp");
		});
	});

	it("moveDown() should request /system/players/<IP>/navigation/moveDown", function() {
		return control.navigation.moveDown().then(function() {
			assertRequested("moveDown");
		});
	});

	it("moveLeft() should request /system/players/<IP>/navigation/moveLeft", function() {
		return control.navigation.moveLeft().then(function() {
			assertRequested("moveLeft");
		});
	});

	it("moveRight() should request /system/players/<IP>/navigation/moveRight", function() {
		return control.navigation.moveRight().then(function() {
			assertRequested("moveRight");
		});
	});

	it("pageUp() should request /system/players/<IP>/navigation/pageUp", function() {
		return control.navigation.pageUp().then(function() {
			assertRequested("pageUp");
		});
	});

	it("pageDown() should request /system/players/<IP>/navigation/pageDown", function() {
		return control.navigation.pageDown().then(function() {
			assertRequested("pageDown");
		});
	});

	it("nextLetter() should request /system/players/<IP>/navigation/nextLetter", function() {
		return control.navigation.nextLetter().then(function() {
			assertRequested("nextLetter");
		});
	});

	it("previousLetter() should request /system/players/<IP>/navigation/previousLetter", function() {
		return control.navigation.previousLetter().then(function() {
			assertRequested("previousLetter");
		});
	});

	it("select() should request /system/players/<IP>/navigation/select", function() {
		return control.navigation.select().then(function() {
			assertRequested("select");
		});
	});

	it("back() should request /system/players/<IP>/navigation/back", function() {
		return control.navigation.back().then(function() {
			assertRequested("back");
		});
	});

	it("contextMenu() should request /system/players/<IP>/navigation/contextMenu", function() {
		return control.navigation.contextMenu().then(function() {
			assertRequested("contextMenu");
		});
	});

	it("toggleOSD() should request /system/players/<IP>/navigation/toggleOSD", function() {
		return control.navigation.toggleOSD().then(function() {
			assertRequested("toggleOSD");
		});
	});

	function assertRequested(relativeUri) {
		expect(server.uri("/system/players/"+CLIENT_HOST+"/navigation/" + relativeUri).requested).to.be(true);
	}

});