var when = require("when");

module.exports = {
	extensionHelper: function(control) {
		if (!control || control.constructor.name !== "PlexControl") {
			throw new TypeError("Needs control parameter to be a PlexControl instance!");
		}

		return {
			performOnClient: function(uri) {
				return when(clientIsResolved(control),  function() {
					var url = "/system/players/" + control.clientAddress + uri;
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
	var deferred;

	if (control.clientAddress) {
		return control.clientAddress;
	}

	deferred = when.defer();
	control.on("resolved", function() {
		deferred.resolve();
	});

	return deferred.promise;
}