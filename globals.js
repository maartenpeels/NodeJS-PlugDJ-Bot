module.exports = function (options)
{
	_ = require('underscore');
	Sequelize = require('sequelize');
	reload = require('require-reload')(require);
	moment = require('moment');
	YouTube = require('youtube-api');
	request = require('request');
	S = require('string');

	lang = options.lang;
	config = options.config;
	bot = options.bot;
	models = require('./models/index');

	botUser = bot.getSelf();

	models.sequelize.sync({force: config.db.forceSequelizeSync}).then(function () {
 		logger('Info', 'DATABASE', 'connected to sqlite database: ' + config.db.database);
    });

	PERMISSIONS = {
        NONE: 0,
        RDJ: 1,
        RDJ_PLUS: 1.5,
        BOUNCER: 2,
        BOUNCER_PLUS: 2.5,
        MANAGER: 3,
        COHOST: 4,
        HOST: 5
    };

    uptime = new Date();
};
