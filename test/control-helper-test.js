var expect = require("expect.js");
var server = require("./lib/server");
var helper = require("../lib/control-helper");

var SERVER_HOST = "localhost";
var CLIENT_HOST = "192.168.0.2";
var CLIENT_NAME = "mac-mini";

var PlexControl = require("..").PlexControl;

function isUriRequested(relativeUri) {
	return server.uri("/system/players/" + CLIENT_HOST + relativeUri).requested;
}

describe("API Facade", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_NAME);
		server.start();
	});

	after(function(done) {
		server.stop(done);
	});

	describe("extensionHelper()", function() {
		var extHelper;

		beforeEach(function() {
			extHelper = helper.extensionHelper(control);
		});

		it("exists", function() {
			expect(helper.extensionHelper).to.be.a('function');
		});

		it("requires control instance as first parameter", function() {
			expect(function() {
				helper.extensionHelper();
			}).to.throwException("TypeError");
		});

		it("should wait for client to be resolved before performing any API-command", function(done) {
			extHelper.performOnClient('/navigation/moveUp').then(function() {
				expect(isUriRequested('/navigation/moveUp')).to.be(true);
				done();
			});

			expect(isUriRequested('/navigation/moveUp')).to.be(false);
		});
	});
});