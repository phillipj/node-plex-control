var PlexAPI = require("plex-api");

var navigation = require("./navigation");
var playback = require("./playback");

module.exports = PlexControl;

function PlexControl(server, client) {
	var port = arguments[2];

	this.api = new PlexAPI(server, port);
	this.client = client;

	if (!isValidClient(client)) {
		throw new TypeError("Invalid client IP or hostname");
	}
}

PlexControl.prototype.getClients = function(callback) {
	this.api.find("/clients", function(err, clientItems) {
		if (Array.isArray(clientItems)) {
			clientItems = clientItems.map(function(client) {
				return client.attributes;
			});
		}

		callback(err, clientItems);
	});
};

PlexControl.prototype.navigation = navigation;
PlexControl.prototype.playback = playback;

function isValidClient(hostname) {
	return typeof hostname === "string";
}