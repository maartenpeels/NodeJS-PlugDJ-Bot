module.exports = function(express) {
	var router = express.Router();

	router.get('/users', function(req, res) {
		models.User.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

	return router;
}
