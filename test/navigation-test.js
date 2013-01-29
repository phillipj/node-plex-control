var buster = require("buster");
var server = require("./server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("..");

function assertRequested(relativeUri) {
	assert(server.uri("/system/players/"+CLIENT_HOST+"/navigation/" + relativeUri).requested);
}

buster.testCase("Navigation", {
	setUp: function() {
		server.start();
		this.control = new PlexControl(SERVER_HOST, CLIENT_HOST);
	},

	tearDown: function() {
		try {
			server.stop();
		} catch (ignoredException) {}
	},

	"module exposes navigation object": function() {
		assert.isObject(this.control.navigation);
	},

	"moveUp() should request /system/players/<IP>/navigation/moveUp": function(done) {
		this.control.navigation.moveUp(function(err) {
			assertRequested("moveUp");
			done();
		});
	},

	"moveDown() should request /system/players/<IP>/navigation/moveDown": function(done) {
		this.control.navigation.moveDown(function(err) {
			assertRequested("moveDown");
			done();
		});
	},

	"moveLeft() should request /system/players/<IP>/navigation/moveLeft": function(done) {
		this.control.navigation.moveLeft(function(err) {
			assertRequested("moveLeft");
			done();
		});
	},

	"moveRight() should request /system/players/<IP>/navigation/moveRight": function(done) {
		this.control.navigation.moveRight(function(err) {
			assertRequested("moveRight");
			done();
		});
	},

	"pageUp() should request /system/players/<IP>/navigation/pageUp": function(done) {
		this.control.navigation.pageUp(function(err) {
			assertRequested("pageUp");
			done();
		});
	},

	"pageDown() should request /system/players/<IP>/navigation/pageDown": function(done) {
		this.control.navigation.pageDown(function(err) {
			assertRequested("pageDown");
			done();
		});
	},

	"nextLetter() should request /system/players/<IP>/navigation/nextLetter": function(done) {
		this.control.navigation.nextLetter(function(err) {
			assertRequested("nextLetter");
			done();
		});
	},

	"previousLetter() should request /system/players/<IP>/navigation/previousLetter": function(done) {
		this.control.navigation.previousLetter(function(err) {
			assertRequested("previousLetter");
			done();
		});
	},

	"select() should request /system/players/<IP>/navigation/select": function(done) {
		this.control.navigation.select(function(err) {
			assertRequested("select");
			done();
		});
	},

	"back() should request /system/players/<IP>/navigation/back": function(done) {
		this.control.navigation.back(function(err) {
			assertRequested("back");
			done();
		});
	},

	"contextMenu() should request /system/players/<IP>/navigation/contextMenu": function(done) {
		this.control.navigation.contextMenu(function(err) {
			assertRequested("contextMenu");
			done();
		});
	},

	"toggleOSD() should request /system/players/<IP>/navigation/toggleOSD": function(done) {
		this.control.navigation.toggleOSD(function(err) {
			assertRequested("toggleOSD");
			done();
		});
	}
});