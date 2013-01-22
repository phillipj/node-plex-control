var buster = require("buster");
var server = require("./server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("..");

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
	}
});