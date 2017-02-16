module.exports = function (bot) {
    bot.on('djListUpdate', function (data) {
		saveWaitList(true);
    });
};
