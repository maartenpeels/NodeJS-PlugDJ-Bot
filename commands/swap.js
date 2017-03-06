exports.names = ['swap'];
exports.hidden = false;
exports.enabled = true;
exports.cdAll = 30;
exports.cdUser = 30;
exports.cdStaff = 0;
exports.minRole = PERMISSIONS.MANAGER;
exports.handler = function (data) {
	var input = data.message.split(' ');
    var params = _.rest(input).join(' ');
    parseCommandParams(data.message, CPARAM.USERNAME, CPARAM.USERNAME).then(function(pdata) {
        var user_1 = pdata.params[0].user;
        var user_2 = pdata.params[1].user;

		if (!user_1 || !user_2) {
	        return;
	    }

	    var position_1 = bot.getWaitListPosition(user_1.id);
	    var position_2 = bot.getWaitListPosition(user_2.id);

	    if (position_1 !== -1 || position_2 !== -1) {
	        if (position_2 === -1) {
	            move_user(user_2.id, position_1);
	            setTimeout(function() {
	                bot.moderateMoveDJ(user_1.id, position_2);
	            }, 500);
	        } else {
	            move_user(user_1.id, position_2);
	            setTimeout(function() {
	               bot.moderateMoveDJ(user_2.id, position_1);
	            }, 500);
	        }
	    }
	});
};
