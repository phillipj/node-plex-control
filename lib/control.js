var PlexAPI = require("plex-api");
var EventEmitter = require("events").EventEmitter;
var check = require("validator").check;
var util = require("util");

var navigation = require("./ext/navigation");
var playback = require("./ext/playback");

module.exports = {
	PlexControl: PlexControl
};

function PlexControl(server, client) {
	var port = arguments[2];

	this.api = new PlexAPI(server, port);
	validateAndSetClient.call(this, client);

	this.navigation = navigation(this);
	this.playback = playback(this);
}

util.inherits(PlexControl, EventEmitter);

PlexControl.prototype.getClients = function(callback) {
	this.api.find("/clients", function(err, clients) {
		if (err) { return callback(err); }
		callback(err, flattenObjectsBy("attributes", clients));
	});
};

PlexControl.prototype.getClientByName = function(name, callback) {
	this.api.find("/clients", {name: name}, function(err, clients) {
		var clientMatch;
		if (err) { return callback(err); }
		if (Array.isArray(clients)) {
			clientMatch = flattenObjectsBy("attributes", clients)[0];
		} 

		callback(err, clientMatch);
	});
};

PlexControl.prototype.setClient = function(client, resolvedCallback) {
	var self = this;
	var callback = resolvedCallback || function() {};

	if (!isValidMachineName(client)) {
		throw new TypeError("Invalid client IP or machine name");
	}

	if (isValidIP(client)) {
		setClientAddressAndEmitResolved(this, client);
		return callback(null, client);
	}

	this.getClientByName(client, function(err, client) {
		var clientAddress = client ? client.address : undefined;

		setClientAddressAndEmitResolved(self, clientAddress);
		callback(err, clientAddress);
	});
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