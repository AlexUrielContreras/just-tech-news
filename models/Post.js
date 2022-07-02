const { Model, DataTypes} = require('sequelize');
const sequelize = require('../config/connections');


class Post extends Model {}

Post.init (
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        post_title: {
            type: DataTypes.STRING,
            allowNull: false
        },

        post_url: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                isUrl: true
            }
        },

        user_id: {
            type: DataTypes.INTEGER,
            references: {
                model: 'user',
                key: 'id'
            }
        }
    },
    {
        sequelize,
        freezeTableName: true,
        underscore: true,
        modelName: 'post'
    }
);

module.exports = Post;