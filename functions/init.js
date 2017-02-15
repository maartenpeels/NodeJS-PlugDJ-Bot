module.exports = function (bot) {
    commands = [];

    loadCommands = function (bot) {
        commands.length = 0;
        try {
            var dir = dpath.resolve(__dirname, '../commands') + '/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    var command = reload(dir + file);

                    command.lastRun = 0;
                    command.lastRunUsers = {};

                    if (command.minRole === undefined) {
                        command.minRole = PERMISSIONS.NONE;
                    }
                    commands.push(command);
                }
            });
            logger('Info', 'Init', 'commands loaded');
        } catch (e) {
            console.error('Unable to load command: ', e.stack);
        }
    };

    loadEvents = function (bot) {
        try {
            var dir = dpath.resolve(__dirname, '../events') + '/';
            fs.readdirSync(dir).forEach(function (file) {
                if (file.indexOf(".js") > -1) {
                    reload(dir + file)(bot);
                }
            });
            logger('Info', 'Init', 'events loaded');
        } catch (e) {
            console.error('Unable to load event: ', e.stack);
        }
    };
};
