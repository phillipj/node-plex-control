var expect = require("expect.js");
var sinon = require("sinon");

var TestServer = require("./lib/server");

var SERVER_HOST = "localhost";
var CLIENT_NAME = "mac-mini";
var CLIENT_ADDRESS = "192.168.0.2";

var PlexControl = require("..").PlexControl;

describe("Module API", function(done) {
	var control;
	var server = new TestServer();

	before(function(done) {
		control = new PlexControl(SERVER_HOST, CLIENT_NAME);
		server.start(32400, done);
	});

	after(function(done) {
		server.stop(done);
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
			expect(control.getClients).to.be.a('function');
		});

		it("should request API resource /clients", function() {
			return control.getClients().done(function(clients) {
				expect(server.uri("/clients").requested).to.be(true);
			});
		});

		it("should retrieve available Plex clients from API", function() {
			return control.getClients().done(function(clients) {
				expect(clients.length).to.be(2);
			});
		});

		it("should flatten clients objects recieved from the API by having the attributes directly onto the object", function() {
			return control.getClients().done(function(clients) {
				expect(clients[1].name).to.be(CLIENT_NAME);
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

					server.start(32400, done);
				});

			});
		});

		it("should resolve promise with undefined when client could not be found", function() {
			return control.getClientInfo("nonexistent-client").done(function(client) {
				expect(client).to.be(undefined);
			});
		});

		it("should resolve promise with client matched by name-attribute from the API", function() {
			return control.getClientInfo(CLIENT_NAME).done(function(client) {
				expect(client.name).to.be(CLIENT_NAME);
				expect(client.address).to.be(CLIENT_ADDRESS);
			});
		});
	});

	describe("setClient()", function() {
		it("exists", function() {
			expect(control.setClient).to.be.a('function');
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

					server.start(32400, done);
				});

			});
		});

		it("should resolve client's IP address when first argument resembles a machine name", function() {
			return control.setClient(CLIENT_NAME).done(function(resolvedIp) {
				expect(resolvedIp).to.be(CLIENT_ADDRESS);
			});
		});

		it("should store client's IP address in the client.address-property of the PlexControl instance", function() {
			return control.setClient(CLIENT_NAME).done(function(resolvedIp) {
				expect(resolvedIp).to.be(control.client.address);
			});
		});

		it("should emit the resolved-event when client's IP address has been resolved", function() {
			var resolvedSpy = sinon.spy();

			control.on("resolved", resolvedSpy);

			return control.setClient(CLIENT_NAME).done(function() {
				expect(resolvedSpy.called).to.be(true);
			});
		});

	});
});