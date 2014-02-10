var fs = require('fs');
var crypto = require('crypto');

module.exports = function LightweightDb(filepath) {
	var self = this;
	var users = null;

	/**
	 * User:
	 * - username
	 * - password
	 * - uuid
	 * - [{client token, access token}]
	 * - 
	 */

	function getUserByUsername(username) {
		for (var i = 0; i < self.users.length; i++) {
			console.log(self.users[i]);
			if (self.users[i].username.toLowerCase() == username.toLowerCase()) {
				return self.users[i];
			}
		}
		return null;
	}

	function getUserByClientToken(clientToken) {
		for (var i = 0; i < self.users.length; i++) {
			self.users[i].tokens = self.users[i].tokens || [];
			for (var j = 0; j < self.users[i].tokens.length; j++) {
				if (self.users[i].tokens[j].clientToken == clientToken) {
					return self.users[i];
				}
			}
		}
	}

	function saveUser(user, callback) {
		for (var i = 0; i < self.users.length; i++) {
			if (self.users[i].username.toLowerCase() == user.username.toLowerCase()) {
				self.users[i] = user;
				break;
			}
		}
		fs.writeFile(filepath, JSON.stringify(self.users, null, '\t'), function (err) {
			if (err) {
				throw err;
			}
			callback();
		});
	}

	this.init = function (callback) {
		self.reload(callback);
	}

	this.reload = function (callback) {
		fs.readFile(filepath, 'utf8', function (err, data) {
			if (err) {
				throw err;
			}
			self.users = JSON.parse(data);
			generateUUIDs(self.users.slice(), callback);
		});

		function generateUUIDs(list, callback) {
			if (list.length == 0) {
				callback();
				return;
			}
			var user = list.pop();
			if (user.uuid) {
				generateUUIDs(list, callback);
			} else {
				self.generateToken(function (uuid) {
					user.uuid = uuid;
					generateUUIDs(list, callback);
				});
			}
		}
	};

	this.login = function (username, password, clientToken, callback) {
		var user = getUserByUsername(username);
		if (user.password == password) {
			self.generateToken(function (accessToken) {
				user.tokens.push({'clientToken': clientToken, 'accessToken': accessToken});
				saveUser(user, function () {
					callback({
						'accessToken': accessToken,
						'clientToken': clientToken,
						'profile': {
							'id': user.uuid,
							'name': user.username
						}
					});
				});
			});
		} else {
			callback(false);
		}
	};

	this.loginWithTokens = function (clientToken, accessToken, callback) {
		var user = getUserByClientToken(clientToken);
		var found = false;
		for (var i = 0; i < user.tokens.length; i++) {
			if (user.tokens[i].clientToken == clientToken && user.tokens[i].accessToken == accessToken) {
				found = true;
				callback({
					'accessToken': accessToken,
					'clientToken': clientToken,
					'profile': {
						'id': user.uuid,
						'name': user.username
					}
				});
//				self.generateToken(function (accessToken) {
//					user.tokens[i].accessToken = accessToken;
//					self.saveUser(user, function () {
//						callback({
//							'accessToken': accessToken,
//							'clientToken': clientToken,
//							'profile': {
//								'id': user.uuid,
//								'name': user.username
//							}
//						});
//					})
//				})
			}
		}
		if (!found) {
			callback(false);
		}
	};

	this.destroyTokens = function (clientToken, accessToken, callback) {
		var user = getUserByClientToken(clientToken);
		for (var i = 0; i < user.tokens.length; i++) {
			if (user.tokens[i].clientToken == clientToken && user.tokens[i].accessToken == accessToken) {
				user.tokens.splice(i, 1);
				break;
			}
		}
		self.saveUser(user, callback);
	};

	this.verifyUser = function (username, accessToken, uuid, callback) {
		var user = getUserByUsername(username);
		if (!user) {
			callback(false);
			return;
		}
		if (user.uuid != uuid) {
			callback(false);
			return;
		}
		var found = false;
		for (var i = 0; i < user.tokens.length; i++) {
			if (user.tokens[i].accessToken == accessToken) {
				found = true;
				callback(true);
			}
		}
		if (!found) {
			callback(false);
		}
	}

	this.generateToken = function (callback) {
		crypto.randomBytes(16, function (ex, buf) {
			if (ex) {
				var hexDigits = '0123456789abcdef';
				var bin = '';
				for (var i = 0; i < 32; i++) {
					bin += hexDigits.charAt(Math.foor(Math.random() * hexDigits.length));
				}
				callback(bin);
			} else {
				callback(buf.toString('hex'));
			}
		});
	};
}