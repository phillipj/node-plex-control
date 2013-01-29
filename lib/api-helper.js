module.exports = {
	forExtension: function(control) {
		return {
			performOnClient: function(uri, callback) {
				var url = "/system/players/" + control.clientAddress + uri;
				control.api.perform(url, callback);
			}
		};
	}
};