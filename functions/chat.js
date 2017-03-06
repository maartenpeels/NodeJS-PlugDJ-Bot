module.exports = function () {
	runCommand = function (name) {
		var command = commands.filter(function (cmd) {
			var found = false;
			for (i = 0; i < cmd.names.length; i++) {
				if (!found) {
					found = (cmd.names[i] == name);
				}
			}
			return found;
		})[0];

		if (command && command.enabled) {
			command.handler(name);
		}
	};

	handleCommand = function (data) {
        if (data.from === undefined || data.from == null || data.from == 'undefined') {
            return;
        }

        data.message = S(data.message).unescapeHTML().s;
        data.message = data.message.replace(/&#39;/g, '\'');
        data.message = data.message.replace(/&#34;/g, '\"');
        data.message = data.message.replace(/&amp;/g, '\&');
        data.message = data.message.replace(/&lt;/gi, '\<');
        data.message = data.message.replace(/&gt;/gi, '\>');
        data.message = data.message.replace('/me ', '');

        if (data.message.charAt(0) === config.commandLiteral) {
            data.message = data.message.substr(1);
            data.message = data.message.replace('@' + botUser.username, '');

            var command = commands.filter(function (cmd) {
                var found = false;
                for (i = 0; i < cmd.names.length; i++) {
                    if (!found) {
                        found = (cmd.names[i] == _.first(data.message.toLowerCase().split(' ')));
                    }
                }
                return found;
            })[0];

            if (command && command.enabled) {
                var can_run_command = true;
                var cur_time = Date.now() / 1000;
                var time_diff = cur_time - command.lastRun;
                var time_diff_user = cur_time;
                if (data.from.id in command.lastRunUsers) {
                    time_diff_user -= command.lastRunUsers[data.from.id];
                }

                if (data.from.role >= PlugAPI.ROOM_ROLE.BOUNCER) {
                    if (command.cdStaff >= time_diff) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdStaff) ' + time_diff);
                        can_run_command = false;
                    }
                } else {
                    if (command.cdAll >= time_diff) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdAll) ' + time_diff);
                        can_run_command = false;
                    } else if (command.cdUser >= time_diff_user) {
                        console.log('[ANTISPAM]', data.from.username + ' cannot run the command due to antispam (cdUser) ' + time_diff_user);
                        can_run_command = false;
                    }
                }

                if (config.verboseLogging) {
                    console.log('[COMMAND]', JSON.stringify(data, null, 2));
                }

                if (config.removeCommands) {
                    bot.moderateDeleteChat(data.cid);
                }

                if (can_run_command && hasPermission(data.from, command.minRole)) {
                    getDbUserFromSiteUser(data.from, function (row) {
                        data.from.db = row;
                        var r = command.handler(data);
                        if (typeof r === 'object' && 'cdAll' in r && 'cdUser' in r) {
                            command.lastRun = cur_time - command.cdAll + r.cdAll;
                            command.lastRunUsers[data.from.id] = cur_time - command.cdUser + r.cdUser;
                        } else if (r !== false) {
                            command.lastRun = cur_time;
                            command.lastRunUsers[data.from.id] = cur_time;
                        }
                    });
                }
            }
        }
    };

    parseCommandParams = function(message) {
        var input = message.split(' ');
        var command = _.first(input).substr(1);
        var rest = _.rest(input);
        var params = {};
        var promises = [];
        for (var i=arguments.length-1; i>=1; --i) {
            var param_type = arguments[i];
            switch (param_type) {
                case CPARAM.FLOAT:
                    var d = rest.pop();
                    var value = parseFloat(d);
                    logger.info(value);
                    if (isNaN(value)) {
                        rest.push(d);
                    } else {
                        params[i-1] = value;
                    }
                    break;

                case CPARAM.INT:
                    var d = rest.pop();
                    var value = parseInt(d);
                    logger.info(value);
                    if (isNaN(value)) {
                        rest.push(d);
                    } else {
                        params[i-1] = value;
                    }
                    break;

                case CPARAM.USERNAME:
                    {
                        var reststr = rest.join(' ');
                        var at_pos = reststr.lastIndexOf('@');
                        if (at_pos == -1 && i-1 == 0) {
                            logger.info('Fallbacking to getting username without @');
                            at_pos = -1;
                        }
                        var username = reststr.substr(at_pos+1);
                        rest = reststr.substr(0, at_pos).split(' ');

                        var x = function() {
                            var index = i-1;
                            promises.push(get_user(username).on('success', function(db_user) {
                                if (db_user) {
                                    var user = _.findWhere(bot.getUsers(), {id: db_user.id});
                                    if (user) {
                                        params[index] = {user: user, db_user: db_user};
                                    } else {
                                        params[index] = {err: 'NOT_IN_ROOM', db_user: db_user};
                                    }
                                } else {
                                    params[index] = {err: 'INVALID_USER'};
                                }
                            }));
                        }();
                    }
                    break;

                case CPARAM.STRING:
                    params[i-1] = rest.pop();
                    break;
            }
        }

        return Promise.settle(promises).then(function() {
            return {
                command: command,
                params: params
            };
        });
    }

	sendChat = function (msg, args) {
		if(args === 'undefined' || args == null)
		{
			if(config.silentMode){
				logger('SilentMode', 'CHAT', msg);
			}else{
				bot.sendChat(msg);
			}
			return;
		}

		for(var key in args)
		{
			msg = msg.replace(config.chatLiteral + key.toLowerCase() + config.chatLiteral, args[key]);
		}

		if(config.silentMode){
			logger('SilentMode', 'CHAT', msg);
		}else{
			bot.sendChat(msg);
		}
	};

	ordinalSuffix = function (num) {
		var j = num % 10,
        k = num % 100;
	    if (j == 1 && k != 11) {
	        return num + "st";
	    }
	    if (j == 2 && k != 12) {
	        return num + "nd";
	    }
	    if (j == 3 && k != 13) {
	        return num + "rd";
	    }
	    return num + "th";
	};
};
