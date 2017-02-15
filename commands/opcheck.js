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
				bot.sendChat(lang.opcheck.isPlayed
					.replace('{amount}', result.count)
					.replace('{extra}', (result.count !=1 ) ? "s" : "")
					.replace('{date}', moment.utc(rows[0]['played_at']).calendar())
					.replace('{from}', moment.utc(rows[0]['played_at']).fromNow()));
            } else {
                bot.sendChat(lang.opcheck.notPlayed);
            }
        });
	}
};
