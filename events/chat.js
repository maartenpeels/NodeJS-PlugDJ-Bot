module.exports = function (bot) {
    bot.on('chat', function (data) {
        if (config.verboseLogging) {
			logger('Error', 'CHAT', JSON.stringify(data, null, 2));
        }
        else if (data.from !== null && data.from.username !== undefined && data.from.username !== null) {
			logger('Info', 'CHAT', data.from.username + ': ' + data.message);
        }

        if (data.from.username !== undefined && data.from.username !== null) {
            data.message = data.message.trim();
            handleCommand(data);
            models.User.update({
                last_active: new Date(),
                last_seen: new Date(),
                locale: data.from.language
            }, {where: {site_id: data.from.id.toString(), site: config.site}});
        }
    });
};
