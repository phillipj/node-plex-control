var buster = require("buster");
var server = require("./server");
var facade = require("../lib/api-facade");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";
var CLIENT_NAME = "mac-mini";

var PlexControl = require("..").PlexControl;

var control;

function isUriRequested(relativeUri) {
	return server.uri("/system/players/" + CLIENT_HOST + relativeUri).requested;
}

buster.testCase("API Facade", {
	setUp: function() {
		server.start();
		control = new PlexControl(SERVER_HOST, CLIENT_NAME);
	},

	tearDown: function() {
		try {
			server.stop();
		} catch (ignoredException) {}
	},

	"extensionHelperForControl()": {
		setUp: function() {
			this.helper = facade.extensionHelperForControl(control);
		},

		"exposed as function": function() {
			assert.isFunction(facade.extensionHelperForControl);
		},

		"requires control instance as first parameter": function() {
			assert.exception(function() {
				facade.extensionHelperForControl();
			}, "TypeError");
		},
	
		"should wait for client to be resolved before performing any API-command": function(done) {
			this.helper.performOnClient('/navigation/moveUp', function(err) {
				assert.isTrue(isUriRequested('/navigation/moveUp'));
				done();
			});

			refute.isTrue(isUriRequested('/navigation/moveUp'));
		}
	}
});