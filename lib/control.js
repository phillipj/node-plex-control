var PlexAPI = require("plex-api");
var EventEmitter = require("events").EventEmitter;
var validator = require("validator");
var util = require("util");
var when = require("when");
var assert = require("assert");

var ExtensionHelper = require("./ext-helper").ExtensionHelper;

var extensions = [require("./ext/navigation"), require("./ext/playback"), require("./ext/currently")];

function PlexControl(serverIp, clientNameOrIp) {
	var port = arguments[2];

	this.api = new PlexAPI(serverIp, port);
	this.extHelper = new ExtensionHelper(this, this.api);

	attachExtensions.call(this);
	validateAndSetClient.call(this, clientNameOrIp);
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

PlexControl.prototype.getSessions = function() {
	assert.notEqual(this.client, null, "Cannot get current sessions before client info has been set!");

	var matchesClientMachineId = function(player){
		return player.attributes.machineIdentifier === this.client.machineIdentifier;
	}.bind(this);

	return this.api.find("/status/sessions").then(function(allSessions){
		var clientSessions = {};

		Object.keys(allSessions).forEach(function(mediaType){
			var arrOfMediaTypes = allSessions[mediaType];
			if (!Array.isArray(arrOfMediaTypes)) {
				arrOfMediaTypes = [arrOfMediaTypes];
			}

			arrOfMediaTypes.forEach(function(anEntryOfMediaType){
				anEntryOfMediaType.player
					.filter(matchesClientMachineId)
					.forEach(function(){
						clientSessions[mediaType] = anEntryOfMediaType;
					});
			});
		});

		return clientSessions;
	});
};

PlexControl.prototype.setClient = function(clientNameOrIp) {
	var self = this;
	var deferred = when.defer();

	if (!isValidMachineName(clientNameOrIp)) {
		throw new TypeError("Invalid client IP or machine name");
	}

	this.getClientInfo(clientNameOrIp).then(function(client) {
		self.client = client;
		self.emit("resolved", client);

		deferred.resolve(client);
	}, deferred.reject);

	return deferred.promise;
};

function validateAndSetClient(clientNameOrIp) {
	if (clientNameOrIp !== undefined) {
		if (!isValidMachineName(clientNameOrIp)) {
			throw new TypeError("Invalid client IP or machine name");
		}
		this.setClient(clientNameOrIp);
	}
}

function isValidMachineName(nameOrIp) {
	return typeof nameOrIp === "string" && nameOrIp.length > 0;
}

function flattenObjectsBy(flattenProperty, objects) {
	return objects.map(function(obj) {
		return obj[flattenProperty];
	});
}

function attachExtensions() {
	extensions.forEach(function(ext) {
		this[ext.name] = ext.initialize(this.extHelper, this);
	}, this);
}

module.exports = {
	PlexControl: PlexControl
};