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

router.route('/users')
	.get(function(req, res) {
		models.User.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

router.route('/songs')
	.get(function(req, res) {
		models.Song.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

router.route('/plays')
	.get(function(req, res) {
		models.Play.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

app.use('/api', router);

app.listen(port);

if(config.showRestLogging){
	logger('Info', 'REST', 'server running on port ' + port);
}
