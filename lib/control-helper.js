var when = require("when");

var clientResolvePromise;

module.exports = {
	extensionHelper: function(control) {
		if (!control || control.constructor.name !== "PlexControl") {
			throw new TypeError("Needs control parameter to be a PlexControl instance!");
		}

		return {
			performOnClient: function(uri) {
				return clientIsResolved(control).then(function(client) {
					var url = "/system/players/" + client.address + uri;
					return control.api.perform(url);
				});
			},

			actionPrefix: function(prefix) {
				var self = this;

				return function (action) {
					return function () {
						return self.performOnClient([prefix, "/", action].join(""));
					};
				};
			},

			createApiFromActions: function(performFn, actions) {
				return actions.reduce(function(api, action) {
					api[action] = performFn(action);
					return api;
				}, {});
			}
		};
	}
};

function clientIsResolved(control) {
	return clientResolvePromise ? clientResolvePromise : createResolvePromise(control);
}

function createResolvePromise(control) {
	var deferred = when.defer();
	clientResolvePromise = deferred.promise;

	control.on("resolved", function(client){
		deferred.resolve(client);
	});

	return clientResolvePromise;
}