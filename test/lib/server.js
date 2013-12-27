var http = require("http");
var fs = require("fs");

var PLEX_SERVER_PORT = 32400;

var requestCountOnUri;

var server = http.createServer(function(req, res) {
	var sampleFilename = "root";

	recordRequestedUri(req.url);

	if (req.url === "/library/sections") {
		sampleFilename = "library_sections";
	}  else if (req.url === "/clients") {
		sampleFilename = "clients";
	} else {
		res.writeHead(200);
		return res.end();
	}

	deliverXml(sampleFilename, res);
}).on('close', function() {
	server.isOpen = false;
});

function deliverXml(filename, response) {
	fs.readFile("test/samples/"+ filename +".xml", function(err, content) {
		response.end(content);
	});
}

function recordRequestedUri(uri) {
	requestCountOnUri[uri] = (requestCountOnUri[uri] || 0) + 1;
}

module.exports = {
	start: function () {
		requestCountOnUri = [];
		server.listen(PLEX_SERVER_PORT, function() {
			server.isOpen = true;
		});
	},

	stop: function(done) {
		if (server.isOpen) {
			server.close(done);
		} else {
			done();
		}
	},

	uri: function(uri) {
		return {
			requested: requestCountOnUri[uri] !== undefined
		};
	},

	requests: function() {
		return requestCountOnUri;
	}
};