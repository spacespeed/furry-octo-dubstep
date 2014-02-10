var http = require('http');
var express = require('express');
var path = require('path');

var routes = require('./routes');
var config = require('./config');
var LightweightDb = require('./models/LightweightDb');
var db = new LightweightDb('./minecraft/users.json');

var app = express();

app.set('port', process.env.PORT || 9010);
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.compress());
app.use(express.methodOverride());
app.use(express.cookieParser(config.local.COOKIE_SECRET));
app.use(express.session());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

db.init(function () {
	routes.init(app, db);

	express().use(express.vhost(config.local.domain, app)).listen(app.get('port'));
});