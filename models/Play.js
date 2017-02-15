"use strict";
module.exports = function (sequelize, DataTypes) {
    var Play = sequelize.define('Play', {
        id: {type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true},
        site_id: {type: DataTypes.STRING, allowNull: false},
        positive: {type: DataTypes.INTEGER, defaultValue: 0},
        negative: {type: DataTypes.INTEGER, defaultValue: 0},
        grabs: {type: DataTypes.INTEGER, defaultValue: 0},
        listeners: {type: DataTypes.INTEGER, defaultValue: 0},
        skipped: {type: DataTypes.INTEGER, defaultValue: 0},
		played_at: {type: DataTypes.DATE, defaultValue: DataTypes.NOW}
    }, {
        underscored: true,
        tableName: 'plays',
        classMethods: {
            associate: function (models) {
                Play.belongsTo(models.Song);
                Play.belongsTo(models.User);
            }
        }
    });

    return Play;
}
