module.exports = {
	name: "playback",
	initialize: function(helper) {
		var actions = ["play", "pause", "stop", "rewind", "fastForward", "stepForward", "bigStepForward",
									"stepBack", "bigStepBack", "skipNext", "skipPrevious"];

		return helper.createApiFromActions(helper.actionPrefix("/playback"), actions);
	}
};