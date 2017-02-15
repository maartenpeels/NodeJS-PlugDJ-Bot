
module.exports = function (bot) {
    saveLastSong = function(data) {
		if (data !== undefined && data !== null && data.media !== undefined && data.media !== null) {
            models.Song.find({
                where: {
                    site: config.site,
                    host: data.media.format,
                    host_id: data.media.cid,
                }
            }).then(function (song) {
                if (song !== null) {
                    getDbUserFromSiteUser(data.dj, function (lastDJ) {
                        models.Play.create({
                            site_id: data.media.id.toString(),
                            user_id: lastDJ.id,
                            song_id: song.id,
                            positive: data.score.positive,
                            negative: data.score.negative,
                            grabs: data.score.grabs,
                            listeners: bot.getUsers().length,
                            skipped: data.score.skipped
                        }).catch(function (err) {
                            console.log('[ERROR] saveLastSong: ', err.stack);
                        });
                    });
                }
            });
        }
	};

	getDbSongFromInfo = function (site_id, callback) {
        models.Song.findOne({
            where: {site_id: site_id},
            order: 'id ASC'
        }).then(function (row) {
            callback(row);
        });
    };
};
