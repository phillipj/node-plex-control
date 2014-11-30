var PlexAPI = require("plex-api");
var EventEmitter = require("events").EventEmitter;
var validator = require("validator");
var util = require("util");
var when = require("when");

var helper = require("./control-helper");

var extensions = [require("./ext/navigation"), require("./ext/playback")];

module.exports = {
	PlexControl: PlexControl
};

function PlexControl(server, client) {
	var port = arguments[2];

	this.api = new PlexAPI(server, port);
	validateAndSetClient.call(this, client);
	attachExtensions.call(this);
}

util.inherits(PlexControl, EventEmitter);

PlexControl.prototype.getClients = function() {
	return this.api.find("/clients").then(function(clients) {
		return flattenObjectsBy("attributes", clients);
	});
};

PlexControl.prototype.getClientInfo = function(nameOrIp) {
	if (!nameOrIp) { throw new TypeError("Missing nameOrIp of client!"); }

	var findFilter = validator.isIP(nameOrIp) ? {address: nameOrIp} : {name: nameOrIp};

	return this.api.find("/clients", findFilter).then(function(clients) {
		var clientMatch;
		if (Array.isArray(clients)) {
			clientMatch = flattenObjectsBy("attributes", clients)[0];
		}

		return clientMatch;
	});
};

PlexControl.prototype.setClient = function(clientNameOrIp) {
	var self = this;
	var deferred = when.defer();

	if (!isValidMachineName(clientNameOrIp)) {
		throw new TypeError("Invalid client IP or machine name");
	}

	this.getClientInfo(clientNameOrIp).then(function(client) {
		var clientAddress = client ? client.address : undefined;

		self.client = client;
		self.emit("resolved", clientAddress);

		deferred.resolve(clientAddress);
	}, deferred.reject);

	return deferred.promise;
};

function validateAndSetClient(client) {
	if (client !== undefined) {
		if (!isValidMachineName(client)) {
			throw new TypeError("Invalid client IP or machine name");
		}
		this.setClient(client);
	}
}

function isValidMachineName(machineName) {
	return typeof machineName === "string" && machineName.length > 0;
}

function flattenObjectsBy(flattenProperty, objects) {
	return objects.map(function(obj) {
		return obj[flattenProperty];
	});
}

function attachExtensions() {
	var self = this;
	var extensionHelper = helper.extensionHelper(this);

	extensions.forEach(function(ext) {
		self[ext.name] = ext.initialize(extensionHelper);
	});
}