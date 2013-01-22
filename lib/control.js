var PlexAPI = require("plex-api");
var util = require("util");

var navigation = require("./navigation");
var playback = require("./playback");

var DEFAULT_SERVER_PORT = 32400;

module.exports = PlexControl;

function PlexControl(server, client) {
	var port = arguments[2];

	if (!isValidClient(client)) {
		throw new TypeError("Invalid client host");
	}

	PlexAPI.call(this, server, port);
	this.client = client;
}

util.inherits(PlexControl, PlexAPI);

PlexControl.prototype.navigation = navigation;
PlexControl.prototype.playback = playback;

function isValidHost(server) {
	return typeof server === "string";
}

function isValidClient(clientHost) {
	return typeof clientHost === "string";
}