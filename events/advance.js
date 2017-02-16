module.exports = function (bot) {
	logger('Info', 'LOADER', 'initialized djAdvance event');
    bot.on('advance', function (data) {
		if(data.media == undefined){
			return;
		}

		if (config.verboseLogging) {
			logger('Info', 'EVENT', 'advance: ' + JSON.stringify(data, null, 2));
        } else {
            logger('Info', 'EVENT', 'advance, now playing: ' + data.media.author + ' - ' + data.media.title);
        }

		getDbSongFromInfo(data.media.id.toString(), function(row) {
			if(row != null)
			{
				if(row.is_banned)
				{
					sendChat(lang.songBanned, {
							medianame: data.media.author + ' - ' + data.media.title,
						 	username: data.currentDJ.username
						});
					bot.moderateForceSkip();
				}
			}
		});

		runCommand('opcheck');

		bot.getHistory(function (history) {
			bot.mediaHistory = history;
		});

		saveLastSong(data.lastPlay);

		bot.woot();

		if (typeof skipTimer !== 'undefined') {
            clearTimeout(skipTimer);
        }
        var nextTimerDelay = (data.media.duration + 10) * 1000;
        if (config.queue.skipStuckSongs) {
            skipTimer = setTimeout(function () {
                if (bot.getMedia() && bot.getMedia().id == data.media.id) {
					sendChat(lang.songStuck, {medianame: data.media.name});
                    bot.moderateForceSkip();
                }
            }, (nextTimerDelay));
        }

		var songData = {
            site: config.site,
            site_id: data.media.id.toString(),
            author: data.media.author,
            title: data.media.title,
            host: data.media.format,
            host_id: data.media.cid,
            duration: data.media.duration,
            image: data.media.image
        };

		models.Song.findOrCreate({
            where: {site: config.site, host: data.media.format, host_id: data.media.cid},
            defaults: songData
        }).catch(function (err) {
			if (config.verboseLogging) {
				logger('Error', 'EVENT', 'error saving song: ' + err.stack + JSON.stringify(data, null, 2));
	        } else {
	            logger('Error', 'EVENT', 'error saving song');
	        }
        });
	});
};
