exports.names = ['skip', 'skipban', 'skipbroken', 'skipnsfw', 'skipoor', 'skiptroll', 'blacklist'];
exports.hidden = true;
exports.enabled = true;
exports.cdAll = 10;
exports.cdUser = 10;
exports.cdStaff = 10;
exports.minRole = PERMISSIONS.RDJ_PLUS;
exports.handler = function (data) {

    var dj = bot.getDJ();
    var media = bot.getMedia();

    if (dj == null) {
        return;
    }

    var input = data.message.split(' ');
    var command = _.first(input);
    var params = _.rest(input, 1);

    var reason = '';
    var notes = '';

    var addToBlacklist = false;
    var banUser = false;

    if (params.length > 0) {
        notes = params.join(' ').trim();
    }

    if (media) {

        switch (command) {
            case 'blacklist':
                reason = '';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipban':
                reason = '';
                addToBlacklist = true;
                banUser = true;
                break;
            case 'skipbroken':
                reason = 'Video broken/removed';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipnsfw':
                reason = 'NSFW/Nudity';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skiptroll':
                reason = 'Troll/Not Music';
                addToBlacklist = true;
                banUser = false;
                break;
            case 'skipoor':
                reason = 'Out of range for theme';
                addToBlacklist = false;
                banUser = false;
                break;
            default:
                reason = '';
                addToBlacklist = false;
                banUser = false;
                break;
        }

        if (addToBlacklist && params.length == 0) {
            models.Song.update({is_banned: 1, banned_reason: reason}, {where: {host_id: media.cid}});
            bot.sendChat("@" + dj.username + ", the song \"" + media.author + " - " + media.title + "\" has been blacklisted, reason: \""+reason+"\".");
        } else if (addToBlacklist) {
            blacklistSongById(notes, data.from);
            return;
        } else if (command == 'skipoor' && params.length > 0) {
            if (notes.match(/\d{4}$/)) {
                var releaseDate = notes + '-01-01';
                models.Song.update({release_date: releaseDate}, {where: {host_id: media.cid}});
            }
            bot.sendChat("@" + dj.username + ", the song \"" + media.author + " - " + media.title + "\" has been marked out of range (released in " + notes + ").");
        }

        if (banUser) {
            bot.moderateBanUser(dj.id, PlugAPI.BAN_REASON.OFFENSIVE_MEDIA, PlugAPI.BAN.PERMA);
        } else {
            bot.moderateForceSkip();
        }
    }
};
