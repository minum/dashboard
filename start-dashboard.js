var config		= require('./conf/config.json');
var dashboard	= require('./');
var express		= require('express');
var app 		= express();

if(config['basic-auth'].enabled) {
	app.use(express.basicAuth(
		config['basic-auth'].username,
		config['basic-auth'].password
	));
}

var mongoUrl = config['mongo-url'];
var port = config.port;

console.info("starting metrics.io dashboard on port: ", port);

dashboard.listen(mongoUrl, app);
app.listen(port);
