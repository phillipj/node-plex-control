var PlexAPI = require("plex-api");
var EventEmitter = require("events").EventEmitter;
var validator = require("validator");
var util = require("util");
var when = require("when");
var assert = require("assert");
var extend = require("util")._extend;

var ExtensionHelper = require("./ext-helper").ExtensionHelper;
var NotFoundError = require("./NotFoundError");

var extensions = [
	require("./ext/navigation"),
	require("./ext/playback"),
	require("./ext/currently")
];

function PlexControl(serverIp, clientNameOrIp, options) {
	options = options || {};

	var apiOptions = extend({
		hostname: serverIp
	}, options);

	this.api = new PlexAPI(apiOptions);
	this.extHelper = new ExtensionHelper(this, this.api);

	attachExtensions.call(this);
	validateAndSetClient.call(this, clientNameOrIp);
}

util.inherits(PlexControl, EventEmitter);

PlexControl.prototype.getClients = function() {
	return this.api.find("/clients");
};

PlexControl.prototype.getClientInfo = function(nameOrIp) {
	if (!nameOrIp) { throw new TypeError("Missing nameOrIp of client!"); }

	var findFilter = validator.isIP(nameOrIp) ? {address: nameOrIp} : {name: nameOrIp};

	return this.api.find("/clients", findFilter).then(function(matches) {
		if (!matches.length) {
			throw new NotFoundError("Could not find client identified by name or IP: "+ nameOrIp);
		}
		return matches[0];
	});
};

PlexControl.prototype.getSessions = function() {
	assert.notEqual(this.client, null, "Cannot get current sessions before client info has been set!");

	var machineIdentifier = this.client.machineIdentifier;

	function matchesMachineId(session){
		var playerElements = session._children.filter(findPlayerElement);
		var matchingPlayers = playerElements.filter(function(player) {
			return player.machineIdentifier === machineIdentifier;
		});
		return matchingPlayers ? matchingPlayers[0] : undefined;
	}

	return this.api.find("/status/sessions").then(function(allSessions){
		return allSessions
				.filter(matchesMachineId)
				.reduce(function(aggregate, current) {
					aggregate[current.type] = current;
					return aggregate;
				}, {});
	});
};

function findPlayerElement(element) {
	return element._elementType === 'Player';
}

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
	PlexControl: PlexControl,
	NotFoundError: NotFoundError
};