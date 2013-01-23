var PlexAPI = require("plex-api");

var navigation = require("./navigation");
var playback = require("./playback");

module.exports = PlexControl;

function PlexControl(server, client) {
	var port = arguments[2];

	this.api = new PlexAPI(server, port);

	if (!isValidClient(client)) {
		throw new TypeError("Invalid client host");
	}

	this.client = client;
}

PlexControl.prototype.navigation = navigation;
PlexControl.prototype.playback = playback;

function isValidHost(server) {
	return typeof server === "string";
}

function isValidClient(clientHost) {
	return typeof clientHost === "string";
}