exports.names = ['reload'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 60;
exports.cdUser = 60;
exports.cdStaff = 60;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
    config = reload(dpath.resolve(__dirname, '../config.json'));
    console.log('Loaded config file from ' + dpath.resolve(__dirname, '../config.json'));

	lang = require(dpath.resolve(__dirname, '../lang/'+config.lang+'.json'));
    console.log('Loaded language file from ' + dpath.resolve(__dirname, 'lang/'+config.lang+'.json'));

    loadCommands(bot);
	sendChat(lang.reloadedConfigAndCommands, {username: data.from.username});
};
