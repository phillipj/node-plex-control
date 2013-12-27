var PlexAPI = require("plex-api");
var EventEmitter = require("events").EventEmitter;
var check = require("validator").check;
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

PlexControl.prototype.getClientByName = function(name) {
	if (!name) {
		throw new TypeError("Missing name of client!");
	}

	return this.api.find("/clients", {name: name}).then(function(clients) {
		var clientMatch;
		if (Array.isArray(clients)) {
			clientMatch = flattenObjectsBy("attributes", clients)[0];
		}

		return clientMatch;
	});
};

PlexControl.prototype.setClient = function(client) {
	var self = this;
	var deferred = when.defer();

	if (!isValidMachineName(client)) {
		throw new TypeError("Invalid client IP or machine name");
	}

	if (isValidIP(client)) {
		setClientAddressAndEmitResolved(this, client);
		return deferred.resolve(client);
	}

	this.getClientByName(client).then(function(client) {
		var clientAddress = client ? client.address : undefined;

		setClientAddressAndEmitResolved(self, clientAddress);
		deferred.resolve(clientAddress);
	}, deferred.reject);

	return deferred.promise;
};

function setClientAddressAndEmitResolved(control, clientAddress) {
	control.clientAddress = clientAddress;
	control.emit("resolved", clientAddress);
}

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

function isValidIP(ip) {
	try {
		check(ip).isIP();
		return true;
	} catch (ex) {
		return false;
	}
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