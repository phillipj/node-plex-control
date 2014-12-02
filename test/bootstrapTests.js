var server = require("./test-lib/server");

before(function(done) {
	server.start(done);
});

after(function(done) {
	server.stop(done);
});

afterEach(function(){
	server.clearRequestHistory();
});
