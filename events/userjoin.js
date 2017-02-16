module.exports = function (bot) {
    bot.on('userJoin', function (data) {
        if (config.verboseLogging) {
			logger('Info', 'JOIN', JSON.stringify(data, null, 2));
        } else if (data.username === 'undefined') {
            logger('Info', 'JOIN', 'guest joined');
        } else {
            logger('Info', 'JOIN', data.username + " joined");
        }

		var newUser = false;

		if (data.username !== undefined && data.username !== botUser.username) {
            getDbUserFromSiteUser(data, function (dbUser) {
				if(dbUser == null)
				{
					newUser = true;
					if (config.welcomeNewUsers) {
						setTimeout(function () {
							models.User.findAndCountAll({
					            where: { site: config.site }
					        }).then(function(result) {
								sendChat(lang.welcome.newUser, {username: data.username, amount: ordinalSuffix(result.count)});
							});
						}, 5000);
                    }
				}
				updateDbUser(data);
			});
		}
	});
};
