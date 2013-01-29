var buster = require("buster");
var server = require("./server");

var SERVER_HOST = "localhost";
var CLIENT_NAME = "mac-mini";
var CLIENT_ADDRESS = "192.168.0.2";

var PlexControl = require("..");

buster.testCase("Module API", {
	setUp: function() {
		server.start();
		this.control = new PlexControl(SERVER_HOST, CLIENT_NAME);
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

	"should require valid client IP or machine name when providing optional second parameter": function() {
		assert.exception(function() {
			new PlexControl(SERVER_HOST, "");
		}, "TypeError");
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
				assert.equals(2, clients.length);
				done();
			});
		},

		"should flatten clients objects recieved from the API by having the attributes directly onto the object": function(done) {
			this.control.getClients(function(err, clients) {
				assert.equals(clients[1].name, CLIENT_NAME);
				done();
			});
		}
	},

	"getClientByName()": {
		"method exists": function() {
			assert.isFunction(this.control.getClientByName);
		},

		"requires client name as first argument": function() {
			assert.exception(function() {
				this.control.getClientByName();
			}, "TypeError");
		},

		"should provide an error object as first callback argument when an error occurs": function(done) {
			server.stop();
			this.control.getClientByName(CLIENT_NAME, function(err) {
				refute.isNull(err);
				done();
			});
		},

		"should not provide any second callback argument when client could not be found": function(done) {
			this.control.getClientByName("nonexistent-client", function(err, client) {
				refute.defined(client);
				done();
			});
		},

		"should provide client matched by name-attribute from the API": function(done) {
			this.control.getClientByName(CLIENT_NAME, function(err, client) {
				assert.equals(client.name, CLIENT_NAME);
				assert.equals(client.address, CLIENT_ADDRESS);
				done();
			});
		}
	},

	"setClient()": {
		"method exists": function() {
			assert.isFunction(this.control.setClient);
		},

		"requires client IP or name as first argument": function() {
			assert.exception(function() {
				this.control.setClient();
			}, "TypeError");
		},

		"should provide an error object as first callback argument when an error occurs": function(done) {
			server.stop();
			this.control.setClient(CLIENT_NAME, function(err) {
				refute.isNull(err);
				done();
			});
		},

		"should resolve client's IP address when first argument resembles a machine name": function(done) {
			this.control.setClient(CLIENT_NAME, function(err, resolvedIp) {
				assert.equals(resolvedIp, CLIENT_ADDRESS);
				done();
			});
		},

		"should not resolve IP address when first argument already is a valid IP": function(done) {
			this.control.setClient(CLIENT_ADDRESS, function(err, resolvedIp) {
				refute(server.uri("/clients").requested);
				done();
			});
		}
	}
});