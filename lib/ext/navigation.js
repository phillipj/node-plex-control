module.exports = {
	name: "navigation",
	initialize: function(helper) {
		function navigate(action) {
			return function () {
				return helper.performOnClient("/navigation/" + action);
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
	}
};