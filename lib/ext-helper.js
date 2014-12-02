var when = require("when");

function ExtensionHelper(control) {
	if (!control || control.constructor.name !== "PlexControl") {
		throw new TypeError("Needs control parameter to be a PlexControl instance!");
	}

	this.control = control;

	createResolvePromise.call(this);
}

ExtensionHelper.prototype.performOnClient = function(uri) {
	var self = this;
	return this.clientIsResolved().then(function(client) {
		var url = "/system/players/" + client.address + uri;
		return self.control.api.perform(url);
	});
};

ExtensionHelper.prototype.actionPrefix = function(prefix) {
	var self = this;
	return function (action) {
		return function () {
			return self.performOnClient([prefix, "/", action].join(""));
		};
	};
};

ExtensionHelper.prototype.createApiFromActions = function(performFn, actions) {
	return actions.reduce(function(api, action) {
		api[action] = performFn(action);
		return api;
	}, {});
};

ExtensionHelper.prototype.clientIsResolved = function() {
	return this.clientResolvedPromise;
};

function createResolvePromise() {
	var deferred = when.defer();
	this.clientResolvedPromise = deferred.promise;
	this.control.on("resolved", deferred.resolve.bind(deferred));
}

exports.ExtensionHelper = ExtensionHelper;
