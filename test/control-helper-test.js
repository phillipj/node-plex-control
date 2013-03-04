var buster = require("buster");
var server = require("./lib/server");
var helper = require("../lib/control-helper");

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

	"extensionHelper()": {
		setUp: function() {
			this.helper = helper.extensionHelper(control);
		},

		"exposed as function": function() {
			assert.isFunction(helper.extensionHelper);
		},

		"requires control instance as first parameter": function() {
			assert.exception(function() {
				helper.extensionHelper();
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