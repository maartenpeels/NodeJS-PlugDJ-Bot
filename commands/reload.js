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

    loadCommands(bot);
	sendChat(lang.reloadedConfigAndCommands, {username: data.from.username});
};
