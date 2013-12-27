module.exports = {
	name: "navigation",
	initialize: function(helper) {
		var actions = ["moveUp", "moveDown", "moveLeft", "moveRight", "pageUp", "pageDown",
									"nextLetter", "previousLetter", "select", "back", "contextMenu", "toggleOSD"];

		return helper.createApiFromActions(helper.actionPrefix("/navigation"), actions);
	}
};