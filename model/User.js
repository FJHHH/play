/**
 * Created by FJH on 2017/1/9.
 */
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('User', {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            field: 'id',
            autoIncrement: true
        },
        userName: {
            type: Sequelize.STRING,
            field: 'userName',
            unique: true,
            allowNull: false
        },
        password: {
            type: Sequelize.STRING,
            field: 'password',
            allowNull: false
        },
        realName: {
            type: Sequelize.STRING,
            field: 'realName',
            allowNull: false
        },
        email: {
            type: Sequelize.STRING,
            field: 'email',
            unique: true,
            allowNull: false
        },
        status: {
            type: Sequelize.INTEGER,
            field: 'status',
            allowNull: false,
            defaultValue: 0
        }
    }, {
        tableName: 'User'
    });
};