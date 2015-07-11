var expect = require("expect.js");
var sinon = require("sinon");

var server = require("../test-lib/server");

var SERVER_HOST = "localhost";
var CLIENT_NAME = "mac-mini";
var CLIENT_ADDRESS = "192.168.0.2";

var NotFoundError = require("../../lib/NotFoundError");
var PlexControl = require("../..").PlexControl;

describe("Module API", function(done) {
	var control;

	before(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_NAME);
	});

	it("exposes constructor", function() {
		expect(PlexControl).to.be.a("function");
	});

	it("should be instance of PlexControl", function() {
		expect(control.constructor.name).to.be("PlexControl");
	});

	it("should require server host as first parameter", function() {
		expect(function() {
			new PlexControl();
		}).to.throwException("TypeError");
	});

	it("should require valid client IP or machine name when providing optional second parameter", function() {
		expect(function() {
			new PlexControl(SERVER_HOST, "");
		}).to.throwException("TypeError");
	});

	describe("getClients()", function() {
		it("exists", function() {
			expect(control.getClients).to.be.a("function");
		});

		it("should request API resource /clients", function() {
			return control.getClients().then(function(clients) {
				expect(server.uri("/clients").requested).to.be(true);
			});
		});

		it("should retrieve available Plex clients from API", function() {
			return control.getClients().then(function(clients) {
				expect(clients.length).to.be(2);
			});
		});
	});

	describe("getClientInfo()", function() {
		it("exists", function() {
			expect(control.getClientInfo).to.be.a('function');
		});

		it("requires client name or IP as first argument", function() {
			expect(function() {
				control.getClientInfo();
			}).to.throwException("TypeError");
		});

		it("should reject promise when an error occurs", function(done) {
			server.stop(function() {

				control.getClientInfo(CLIENT_NAME).catch(function(err) {
					expect(err).not.to.be(null);

					server.start(done);
				});

			});
		});

		it("should reject promise with a NotFoundError when client could not be found", function() {
			return control.getClientInfo("nonexistent-client").then(null, function(err) {
				expect(err).to.be.an(NotFoundError);
			});
		});

		it("should resolve promise with client matched by name-attribute from the API", function() {
			return control.getClientInfo(CLIENT_NAME).then(function(client) {
				expect(client.name).to.be(CLIENT_NAME);
				expect(client.address).to.be(CLIENT_ADDRESS);
			});
		});
	});

	describe("getSessions()", function() {

		it("exists", function() {
			expect(control.getSessions).to.be.a("function");
		});

		it("requires client to already have been set", function() {
			var origClient = control.client;
			delete control.client;

			expect(function() {
				control.getSessions();
			}).to.throwException("Error");

			control.client = origClient;
		});

		it("should return a promise resolving to an object", function() {
			return control.getSessions().then(function(sessions){
				expect(sessions).to.be.an("object");
			});
		});

		it("should have a photo-property in returned object when client has a photo session", function() {
			return control.getSessions().then(function(sessions){
				expect(sessions).to.have.property("photo");
				expect(sessions.photo.title).to.be("IMG_1731");
			});
		});

		it("should have a video-property in returned object when client has a video session", function() {
			return control.getSessions().then(function(sessions){
				expect(sessions).to.have.property("episode");
				expect(sessions.episode.title).to.be("An episode");
			});
		});

		it("should not have a track-property in returned object when client doesnt have a track session", function() {
			return control.getSessions().then(function(sessions){
				expect(sessions).to.not.have.property("track");
			});
		});

	});

	describe("setClient()", function() {
		it("exists", function() {
			expect(control.setClient).to.be.a("function");
		});

		it("requires client IP or name as first argument", function() {
			expect(function() {
				control.setClient();
			}).to.throwException("TypeError");
		});

		it("should reject promise when an error occurs", function(done) {
			server.stop(function() {

				control.setClient(CLIENT_NAME).catch(function(err) {
					expect(err).not.to.be(null);

					server.start(done);
				});

			});
		});

		it("should store resolved client in the .client-property of the PlexControl instance", function() {
			return control.setClient(CLIENT_NAME).then(function(resolvedClient) {
				expect(resolvedClient.address).to.be(control.client.address);
			});
		});

		it("should emit the resolved-event when client's IP address has been resolved", function() {
			var resolvedSpy = sinon.spy();

			control.on("resolved", resolvedSpy);

			return control.setClient(CLIENT_NAME).then(function() {
				expect(resolvedSpy.called).to.be(true);
			});
		});

	});
});