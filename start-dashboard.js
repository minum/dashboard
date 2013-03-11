var config		= require('./conf/config.json');
var dashboard	= require('./');
var express		= require('express');
var app 		= express();
var cluster		= require('cluster');
var os			= require('os');

if(process.env.NODE_ENV=='production') {
	enableCluster();
}

if(config['basic-auth'].enabled) {
	app.use(express.basicAuth(
		config['basic-auth'].username,
		config['basic-auth'].password
	));
}

var mongoUrl = config['mongo-url'];
//for heroku support
var port = process.env.PORT || config.port;

console.info("starting minum dashboard on port: ", port);

dashboard.listen(mongoUrl, app);
app.listen(port);

function enableCluster() {

	if(cluster.isMaster) {
		for(var lc=0; lc<os.cpus().length; lc++) {
			cluster.fork();
		}

		cluster.on('listening', function(worker) {

			console.info('listening cluster worker', worker.id);
		});

		cluster.on('exit', function(worker) {

			console.info('exiting worker', worker.id);
			cluster.fork();
		});
	}
}