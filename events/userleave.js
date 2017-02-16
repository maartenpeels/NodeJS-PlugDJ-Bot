module.exports = function (bot) {
    bot.on('userLeave', function (data) {
		if(data.username === 'undefined')//User is a guest
		{
			logger('Info', 'LEAVE', 'user left: guest');
			return;
		}

        logger('Info', 'LEAVE', 'user left: ' + data.username);
        models.User.update({last_leave: new Date()}, {where: {site: config.site, site_id: data.id.toString()}});

		saveWaitList(true);
    });
};
