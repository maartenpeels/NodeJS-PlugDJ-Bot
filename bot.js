dpath = require('path');
fs = require('fs');
logger = require('jethro');
PlugAPI = require('plugapi');

if (fs.existsSync(dpath.resolve(__dirname, 'configState.json'))) {
    config = require(dpath.resolve(__dirname, 'configState.json'));
    console.log('Loaded config file from ' + dpath.resolve(__dirname, 'configState.json'));
} else {
    config = require(dpath.resolve(__dirname, 'config.json'));
    console.log('Loaded config file from ' + dpath.resolve(__dirname, 'config.json'));
}

if (fs.existsSync(dpath.resolve(__dirname, 'lang/'+config.lang+'.json'))) {
	lang = require(dpath.resolve(__dirname, 'lang/'+config.lang+'.json'));
    console.log('Loaded language file from ' + dpath.resolve(__dirname, 'lang/'+config.lang+'.json'));
} else {
	logger('Error', 'LANG', 'no (known) language specified in config');
	process.exit();
}

new PlugAPI(
{
    email: config.auth.username,
    password: config.auth.password
}, function (err, bot)
{
    if (err)
    {
        logger('Error', 'PlugAPI', 'while initializing: ' + err);
    }
    else
    {
		bot.deleteAllChat = true;
        bot.multiLine = true;
        bot.multiLineLimit = 3;

        require('./globals')({bot: bot, config: config, lang: lang});

		initModules(bot);

        bot.connect(config.roomName);
		logger('Info', 'Bot', 'joining ' + config.roomName);
    }
});

function initModules(bot)
{
    try
    {
        var dir = dpath.resolve(__dirname, 'functions') + '/';
        fs.readdirSync(dir).forEach(function (file)
        {
            if (file.indexOf(".js") > -1)
            {
                require(dir + file)(bot);
            }
        });
    }
    catch (e)
    {
        console.error('[ModuleLoader] Unable to load function: ', e.stack);
    }

    loadEvents(bot);
    loadCommands(bot);
} 
