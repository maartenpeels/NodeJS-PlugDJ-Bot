"use strict";
module.exports = function (sequelize, DataTypes) {
    var Song = sequelize.define('Song', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        site: {type: DataTypes.STRING, allowNull: false, defaultValue: 'dubtrack', unique: 'site_host_id'},
        site_id: {type: DataTypes.STRING, allowNull: false, unique: true},
        author: {type: DataTypes.STRING},
        title: {type: DataTypes.STRING},
        description: {type: DataTypes.TEXT},
        release_date: {type: DataTypes.DATEONLY},
        tags: {type: DataTypes.STRING},
        host: {type: DataTypes.STRING, allowNull: false, defaultValue: 'youtube', unique: 'site_host_id'},
        host_id: {type: DataTypes.STRING, allowNull: false, unique: 'site_host_id'},
        permalink: {type: DataTypes.STRING},
        duration: {type: DataTypes.INTEGER},
        image: {type: DataTypes.STRING},
        is_banned: {type: DataTypes.BOOLEAN, defaultValue: 0},
        banned_reason: {type: DataTypes.STRING}
    }, {
        underscored: true,
        tableName: 'songs',
        classMethods: {
            associate: function (models) {
                Song.hasMany(models.Play);
            }
        }
    });

    return Song;
}
