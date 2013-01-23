var buster = require("buster");
var PlexAPI = require("plex-api");
var server = require("./server");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";

var PlexControl = require("..");

buster.testCase("Module API", {
	setUp: function() {
		server.start();
		this.control = new PlexControl(SERVER_HOST, CLIENT_HOST);
	},

	tearDown: function() {
		try {
			server.stop();
		} catch (ignoredException) {}
	},

	"module exposes constructor": function() {
		assert.isFunction(PlexControl);
	},

	"objects should be instance of PlexControl": function() {
		assert.equals(this.control.constructor.name, "PlexControl");
	},

	"should require server host as first parameter": function() {
		assert.exception(function() {
			new PlexControl();
		}, "TypeError");
	},

	"should require client IP or host as second parameter": function() {
		assert.exception(function() {
			new PlexControl(SERVER_HOST);
		}, "TypeError");
	},
});