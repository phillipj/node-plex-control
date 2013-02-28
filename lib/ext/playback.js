var facade = require("../api-facade");

module.exports = function(control) {
	var helper = facade.extensionHelperForControl(control);

	function navigate(action) {
		return function (callback) {
			helper.performOnClient("/playback/" + action, callback);
		};
	}

	return {
		play: navigate("play"),
		stop: navigate("stop"),
		rewind: navigate("rewind"),
		fastForward: navigate("fastForward"),
		stepForward: navigate("stepForward"),
		bigStepForward: navigate("bigStepForward"),
		stepBack: navigate("stepBack"),
		bigStepBack: navigate("bigStepBack"),
		skipNext: navigate("skipNext"),
		skipPrevious: navigate("skipPrevious")
	};
};