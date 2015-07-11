var http = require("http");
var fs = require("fs");

var PLEX_SERVER_PORT = 32400;

function TestServer() {
	this._requestCountOnUri = {};
	this._specificResponse = {};

	this.server = createHttpServer(this);
	this.server.on("request", recordRequestedUri.bind(this));
}

TestServer.prototype.start = function(cb) {
	this.server.listen(PLEX_SERVER_PORT, cb);
};

TestServer.prototype.requests = function() {
	return this._requestCountOnUri;
};

TestServer.prototype.uri = function(uri) {
	return {
		requested: this._requestCountOnUri[uri] !== undefined
	};
};

TestServer.prototype.stop = function(cb) {
	this.server.close(cb);
};

TestServer.prototype.clearRequestHistory = function() {
	this._requestCountOnUri = {};
};

TestServer.prototype.nextResponseOnUrl = function(url, jsonFilename) {
	this._specificResponse[url] = jsonFilename;
};

function recordRequestedUri(req) {
	var uri = req.url;
	this._requestCountOnUri[uri] = (this._requestCountOnUri[uri] || 0) + 1;
}

function createHttpServer(serverWrapper) {
	return http.createServer(function(req, res) {
		var requestedPath = req.url.substr(1).replace('/', '_');
		var jsonFilename = serverWrapper._specificResponse[req.url] || requestedPath +".json";

		res.writeHead(200, {
			'Content-Type': 'application/json'
		});

		if (["clients", "status_sessions"].indexOf(requestedPath) === -1) {
			return res.end();
		}

		// just in case a specific response was set for this URL
		delete serverWrapper._specificResponse[req.url];

		fs.createReadStream("test/samples/"+ jsonFilename).pipe(res);
	}).on("error", function(err){
		console.error("Error from the test server:", err.stack);
	});
}

module.exports = new TestServer();