var http = require("http");
var fs = require("fs");

function TestServer() {
	this.requestCountOnUri = {};
	this.server = createHttpServer(this);
	this.server.on("request", recordRequestedUri.bind(this));
}

TestServer.prototype.start = function(port, cb) {
	this.server.listen(port, cb);
};

TestServer.prototype.requests = function() {
	return this.requestCountOnUri;
};

TestServer.prototype.uri = function(uri) {
	return {
		requested: this.requestCountOnUri[uri] !== undefined
	};
};

TestServer.prototype.stop = function(cb) {
	this.server.close(cb);
};

function recordRequestedUri(req) {
	var uri = req.url;
	this.requestCountOnUri[uri] = (this.requestCountOnUri[uri] || 0) + 1;
}

function createHttpServer(serverWrapper) {
	return http.createServer(function(req, res) {
		var sampleFilename = "root";

		if (req.url === "/library/sections") {
			sampleFilename = "library_sections";
		}  else if (req.url === "/clients") {
			sampleFilename = "clients";
		} else {
			res.writeHead(200);
			return res.end();
		}

		fs.createReadStream("test/samples/"+ sampleFilename +".xml").pipe(res);
	}).on("error", function(err){
		console.error("Error from the test server:", err.stack);
	});
}

module.exports = TestServer;