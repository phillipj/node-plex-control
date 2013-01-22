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

	"PlexControl should extend PlexAPI": function() {
		assert(this.control instanceof PlexAPI);
	},

	"should require first parameter": function() {
		assert.exception(function() {
			new PlexControl();
		}, "TypeError");
	},

	"third parameter should set port of Plex Media Server": function() {
		this.control = new PlexControl(SERVER_HOST, CLIENT_HOST, 32400);
		assert.equals(this.control.getPort(), 32400);
	},

	"port should be 32400 when second parameter is not given in constructor": function() {
		assert.equals(this.control.getPort(), 32400);
	},

});