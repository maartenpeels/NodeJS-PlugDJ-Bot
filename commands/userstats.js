exports.names = ['me', 'mystats'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 0;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
	models.User.find({
		where: {
			site_id: data.from.id
		}
	}).then(function(user) {
		if(user)
		{
			models.sequelize.query('SELECT COUNT(*) AS total_songs, COUNT(DISTINCT song_id) AS unique_songs, SUM(positive) as positive, SUM(negative) as negative, SUM(grabs) as grabs FROM plays WHERE user_id='+user.id, { type: models.sequelize.QueryTypes.SELECT})
			  .then(function(plays) {
				  sendChat(lang.userStats, {
					  username: user.username,
					  total_songs: plays[0].total_songs,
					  unique_songs: plays[0].unique_songs,
					  positive: plays[0].positive,
					  negative: plays[0].negative,
					  grabs: plays[0].grabs
				  });
			});
		}
	});
};
