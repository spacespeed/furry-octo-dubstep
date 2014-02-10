module.exports.init = function (app, db) {
	app.get('/game/joinserver', joinserver);
	app.get('/game/checkserver', checkserver);

	var users = {};

	function joinserver(req, res) {
		var username = req.query.user;
		// of form token:accessToken:UUID
		var sessionId = req.query.sessionId.split(':');
		var serverId = req.query.serverId;

		db.verifyUser(username, sessionId[1], sessionId[2], function (verified) {
			if (verified) {
				users[username] = serverId;
				res.end('OK');
			} else {
				res.end('Bad Token');
			}
		});
	}

	function checkserver(req, res) {
		var username = req.query.user;
		var serverId = req.query.serverId;

		if (users[username] == serverId) {
			res.end('YES');
		} else {
			res.end('NO');
		}
	}
};