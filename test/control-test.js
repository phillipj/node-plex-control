var buster = require("buster");
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

	"// should have optional third parameter setting server port": function() {
		this.control = new PlexControl(SERVER_HOST, CLIENT_HOST, 32401);
	},

	"getClients": {
		"method exists": function() {
			assert.isFunction(this.control.getClients);
		},

		"should request API resource /clients": function(done) {
			this.control.getClients(function(err, clients) {
				assert(server.uri("/clients").requested);
				done();
			});
		},

		"should retrieve available Plex clients from API": function(done) {
			this.control.getClients(function(err, clients) {
				assert.equals(1, clients.length);
				done();
			});
		},

		"should flatten clients objects recieved from the API by having the attributes directly onto the object": function(done) {
			this.control.getClients(function(err, clients) {
				assert.equals(clients[0].name, "mac-mini");
				done();
			});
		}
	}
});