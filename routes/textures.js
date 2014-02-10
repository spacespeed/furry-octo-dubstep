var fs = require('fs');
var path = require('path');

var usernameRegex = /^\w+$/

module.exports.init = function (app, db) {
	app.get('/skin/:username', getSkin);
	app.get('/cloak/:username', getCloak);

	function getSkin(req, res) {
		if (!req.params.username.match(usernameRegex)) {
			res.writeHead(403);
			res.end('Invalid username');
		}
		var skinPath = path.join('./minecraft/skins/', req.params.username + '.png');
		fs.exists(skinPath, function (exists) {
			if (exists) {
				res.sendfile(skinPath);
			} else {
				res.writeHead(404);
				res.end('Skin does not exist');
			}
		});
	}

	function getCloak(req, res) {
		if (!req.params.username.match(usernameRegex)) {
			res.writeHead(403);
			res.end();
		}
		var cloakPath = path.join('./minecraft/cloaks/', req.params.username + '.png');
		fs.exists(cloakPath, function (exists) {
			if (exists) {
				res.sendfile(cloakPath);
			} else {
				res.writeHead(404);
				res.end('Cloak does not exist');
			}
		});
	}
};