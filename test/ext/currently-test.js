var expect = require("expect.js");

var server = require("../test-lib/server");

var SERVER_HOST = "localhost";
var CLIENT_HOST_MACMINI = "mac-mini";
var CLIENT_HOST_IMAC = "imac";

var PlexControl = require("../..").PlexControl;

describe("Currently extension", function() {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_HOST_MACMINI);
	});

	it("should resolve to an object with .type == 'photo' when client is displaying a photo", function() {
		return control.currently.playing().then(function(result) {
			expect(result.type).to.be("photo");
		});
	});

	it("should resolve to an object with .type == 'episode' when client has paused an episode", function() {
		return control.currently.paused().then(function(result) {
			expect(result.type).to.be("episode");
		});
	});

	it("should resolve to undefined when client doesnt match any paused sessions", function() {
		var imacControl = new PlexControl(SERVER_HOST, CLIENT_HOST_IMAC);
		return imacControl.currently.paused().then(function(result) {
			expect(result).to.be(undefined);
		});
	});

	it("should resolve to an object with .type == 'track' when server has only having one session and client is playing a track", function() {
		var imacControl = new PlexControl(SERVER_HOST, CLIENT_HOST_IMAC);

		server.nextResponseOnUrl("/status/sessions", "status_sessions_single.json");

		return imacControl.currently.playing().then(function(result) {
			expect(result.type).to.be("track");
		});
	});



});