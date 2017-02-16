module.exports = function(express) {
	var router = express.Router();

	router.get('/plays', function(req, res) {
		models.Play.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

	return router;
}
