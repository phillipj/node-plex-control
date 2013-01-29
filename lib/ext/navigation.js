var api = require("../api-helper");

module.exports = function(control) {
	var helper = api.forExtension(control);

	function navigate(action) {
		return function (callback) {
			helper.performOnClient("/navigation/" + action, callback);
		};
	}

	return {
		moveUp: navigate("moveUp"),
		moveDown: navigate("moveDown"),
		moveLeft: navigate("moveLeft"),
		moveRight: navigate("moveRight"),
		pageUp: navigate("pageUp"),
		pageDown: navigate("pageDown"),
		nextLetter: navigate("nextLetter"),
		previousLetter: navigate("previousLetter"),
		select: navigate("select"),
		back: navigate("back"),
		contextMenu: navigate("contextMenu"),
		toggleOSD: navigate("toggleOSD")
	};
};