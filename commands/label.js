exports.names = ['label', 'tag'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 0;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
	var label = _.rest(data.message.split(' '), 1).join('-').trim().toLowerCase();
	nowPlaying = bot.getMedia();

	if(nowPlaying != null){
		models.Song.find({
			where: {
				site_id: nowPlaying.id,
				site: config.site
			}
		}).then(function(song) {
			song.updateAttributes({label: label});
		});
	}
};
