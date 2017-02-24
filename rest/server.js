// call the packages we need
var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var pack 	   = require('../package.json');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

var port = process.env.PORT || 8080;

var router = express.Router();

router.use(function(req, res, next) {
    if(config.showRestLogging)
	{
		logger('Info', 'REST', req.method + " " + req.url);
	}
    next();
});

router.get('/', function(req, res) {
    res.json({
		message: 'Welcome to the API, check out ' + lang.rest.infoLink + ' for information on how to use it.',
		version: pack.restVersion
 	});
});

app.use('/api', router);

var userEndpoint = require('./endpoints/users')(express);
var songEndpoint = require('./endpoints/songs')(express);
var playEndpoint = require('./endpoints/plays')(express);
var waitEndpoint = require('./endpoints/waitlist')(express);

app.use('/api', userEndpoint);
app.use('/api', songEndpoint);
app.use('/api', playEndpoint);
app.use('/api', waitEndpoint);

app.listen(port);

if(config.showRestLogging){
	logger('Info', 'REST', 'server running on port ' + port);
}
