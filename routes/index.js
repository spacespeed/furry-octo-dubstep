module.exports.init = function (app, db) {
	require('./authentication').init(app, db);
	require('./game').init(app, db);
	require('./textures').init(app, db);
};