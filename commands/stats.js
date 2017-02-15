exports.names = ['boothstats'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.NONE;
exports.handler = function (data) {
    models.sequelize.query('SELECT COUNT(*) AS total_songs, COUNT(DISTINCT song_id) AS unique_songs, COUNT(DISTINCT user_id) AS total_djs, SUM(positive) as positive, SUM(negative) as negative, SUM(grabs) as grabs FROM plays', { type: models.sequelize.QueryTypes.SELECT})
	  .then(function(plays) {
	      bot.sendChat(lang.boothstats
			  .replace('{total_songs}', plays[0].total_songs)
			  .replace('{unique_songs}', plays[0].unique_songs)
			  .replace('{total_djs}', plays[0].total_djs)
			  .replace('{positive}', plays[0].positive)
			  .replace('{negative}', plays[0].negative)
			  .replace('{grabs}', plays[0].grabs)
		  );
	});
};
