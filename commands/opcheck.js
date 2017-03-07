exports.names = ['opsong', 'opcheck', 'op'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 180;
exports.cdUser = 180;
exports.cdStaff = 20;
exports.minRole = PERMISSIONS.BOUNCER;
exports.handler = function (data) {
	nowPlaying = bot.getMedia();
	if(nowPlaying != null){
		models.Play.findAndCountAll({
            where: { site_id: nowPlaying.id },
            order: 'played_at DESC'
        }).then(function(result) {
			rows = result.rows;
			if (rows && rows.length > 0) {
				models.Song.findAll({
					where: {id: rows[0]['song_id']}
				}).then(function(song) {
					extra = "[labeled]";
					if(song[0]["label"] === 'undefined' || song[0]["label"] == null)
					{
						extra = "[unlabeled]";
					}

					now = new Date();
					weekAgo = now - 1000 * 60 * 60 * 24 * 7;
					weekAgo = new Date(weekAgo);

					monthAgo = now - 1000 * 60 * 60 * 24 * 37;//Aprox
					monthAgo = new Date(monthAgo);

					startWeek = weekAgo;
					endWeek = new Date();

					startMonth = monthAgo;
					endMonth = weekAgo;

					monthCount = 0;
					weekCount = 0;

					for (var i = rows.length - 1; i >= 0; i--) {
						playedAt = rows[i]['played_at'];
						if(playedAt <= endWeek && playedAt > startWeek)
						{
							weekCount++
						}else if(playedAt <= endMonth && playedAt > startMonth)
						{
							monthCount++;
						}
					}

					sendChat(extra + lang.opcheck.isPlayed, {
						amount: result.count,
						extra: (result.count !=1 ) ? "s" : "",
						week: weekCount,
						month: monthCount,
						date: moment.utc(rows[0]['played_at']).calendar(),
						from: moment.utc(rows[0]['played_at']).fromNow()
					});

				});
			} else {
				sendChat(lang.opcheck.notPlayed);
			}
        });
	}
};
