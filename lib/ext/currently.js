function CurrentlyExtension(helper, control) {
	this.helper = helper;
	this.control = control;
}

CurrentlyExtension.prototype.playing = function() {
	return this.helper.clientIsResolved().then(findSessionWithState('playing', this.control));
};

CurrentlyExtension.prototype.paused = function() {
	return this.helper.clientIsResolved().then(findSessionWithState('paused', this.control));
};

function findSessionWithState(stateToMatch, control) {
	return function(client) {
		return control.getSessions().then(function(sessions){
			return Object.keys(sessions).reduce(sessionWithPlayerState(stateToMatch, client, sessions), undefined);
		});
	};
}

function sessionWithPlayerState(stateToMatch, client, sessions) {
	return function(foundSession, sessionMediaType){
		var singleSession = sessions[sessionMediaType];
		if (!foundSession && hasPlayerState(stateToMatch, singleSession, client)) {
			foundSession = singleSession;
		}
		return foundSession;
	};
}

function hasPlayerState(stateToMatch, session, client) {
	return session.player.some(function(p){
		return p.attributes.machineIdentifier === client.machineIdentifier && p.attributes.state === stateToMatch;
	});
}

module.exports = {
	name: "currently",
	initialize: function(helper, control) {
		return new CurrentlyExtension(helper, control);
	}
};