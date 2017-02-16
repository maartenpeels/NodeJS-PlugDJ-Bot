module.exports = function(express) {
	var router = express.Router();

	router.get('/songs', function(req, res) {
		models.Song.findAll().then(function (result) {
			if(!result)
				res.json({
					message: 'Whoops! Something went wrong executing your request..'
				});

			res.json(result);
		});
	});

	return router;
}
