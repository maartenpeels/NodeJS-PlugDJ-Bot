module.exports = function(express) {
	var router = express.Router();

	router.get('/waitlist', function(req, res) {
		res.json(bot.getWaitList());
	});

	return router;
}
