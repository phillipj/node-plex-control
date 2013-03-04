var config = module.exports;

config["Plex Control tests"] = {
	env: "node",
	rootPath: "../",
	libs: ["test/lib/**/*.js"],
	tests: ["test/**/*-test.js"]
};