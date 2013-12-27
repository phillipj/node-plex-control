var expect = require("expect.js");
var sinon = require("sinon");
var server = require("./lib/server");

var SERVER_HOST = "localhost";
var CLIENT_NAME = "mac-mini";
var CLIENT_ADDRESS = "192.168.0.2";

var PlexControl = require("..").PlexControl;

describe("Module API", function(done) {
	var control;

	beforeEach(function() {
		control = new PlexControl(SERVER_HOST, CLIENT_NAME);
		server.start();
	});

	afterEach(function(done) {
		server.stop(done);
	});

	it("exposes constructor", function() {
		expect(PlexControl).to.be.a('function');
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

		it("should request API resource /clients", function(done) {
			control.getClients(function(err, clients) {
				expect(server.uri("/clients").requested).to.be(true);
				done();
			});
		});

		it("should retrieve available Plex clients from API", function(done) {
			control.getClients(function(err, clients) {
				expect(clients.length).to.be(2);
				done();
			});
		});

		it("should flatten clients objects recieved from the API by having the attributes directly onto the object", function(done) {
			control.getClients(function(err, clients) {
				expect(clients[1].name).to.be(CLIENT_NAME);
				done();
			});
		});
	});

	describe("getClientByName()", function() {
		it("exists", function() {
			expect(control.getClientByName).to.be.a('function');
		});

		it("requires client name as first argument", function() {
			expect(function() {
				control.getClientByName();
			}).to.throwException("TypeError");
		});

		it("should provide an error object as first callback argument when an error occurs", function(done) {
			server.stop(function() {
				control.getClientByName(CLIENT_NAME, function(err) {
					expect(err).not.to.be(null);
					done();
				});
			});
		});

		it("should not provide any second callback argument when client could not be found", function(done) {
			control.getClientByName("nonexistent-client", function(err, client) {
				expect(client).to.be(undefined);
				done();
			});
		});

		it("should provide client matched by name-attribute from the API", function(done) {
			control.getClientByName(CLIENT_NAME, function(err, client) {
				expect(client.name).to.be(CLIENT_NAME);
				expect(client.address).to.be(CLIENT_ADDRESS);
				done();
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

		it("should provide an error object as first callback argument when an error occurs", function(done) {
			server.stop(function() {
				control.setClient(CLIENT_NAME, function(err) {
					expect(err).not.to.be(null);
					done();
				});
			});
		});

		it("should resolve client's IP address when first argument resembles a machine name", function(done) {
			control.setClient(CLIENT_NAME, function(err, resolvedIp) {
				expect(resolvedIp).to.be(CLIENT_ADDRESS);
				done();
			});
		});

		it("should store client's IP address in the clientAddress-property of the PlexControl instance", function(done) {
			control.setClient(CLIENT_NAME, function(err, resolvedIp) {
				expect(resolvedIp).to.be(control.clientAddress);
				done();
			});
		});

		it("should emit the resolved-event when client's IP address has been resolved", function(done) {
			var resolvedSpy = sinon.spy();

			control.on("resolved", resolvedSpy);

			control.setClient(CLIENT_NAME, function(err, resolvedIp) {
				expect(resolvedSpy.called).to.be(true);
				done();
			});
		});

		it("should not resolve IP address when first argument already is a valid IP", function(done) {
			var resolvedSpy = sinon.spy();

			control.on("resolved", resolvedSpy);

			control.setClient(CLIENT_ADDRESS, function(err, resolvedIp) {
				expect(server.uri("/clients").requested).to.be(false);
				expect(resolvedSpy.called).to.be(true);
				done();
			});
		});
	});
});