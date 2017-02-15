module.exports = function (bot) {
    bot.on('roomJoin', function (data) {
        logger('Info', 'INIT', 'Ready - joined room: ' + config.roomName);
        if (config.verboseLogging) {
            logger('Info', 'INIT', 'Room data: ' + JSON.stringify(data, null, 2));
        }

        botUser = bot.getSelf();

        getDbUserFromSiteUser(botUser, function (row) {
            botUser.db = row;
        });

        if (config.verboseLogging) {
            logger('Info', 'INIT', 'data loaded for ' + botUser.username + '\n ' + JSON.stringify(botUser, null, 2));
        }

		if(config.welcome){
			sendChat(lang.botConnect, {botname: config.botName});
		}

		setTimeout(function () {
			bot.getUsers().forEach(function (user) {
	            updateDbUser(user);
	        });
		}, 1000);

        bot.woot();
    });
};
