const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connections');

// create user model 
class User extends Model {}

User.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },

        username: {
            type: DataTypes.STRING,
            allowNull: false
        },

        email: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
            validate: {
                // checks for a email format
                isEmail: true
            }
        },

        password: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                // makes the password be no less then 4 char
                len: [4]
            }
        }

    },
    {
        // pass in our imported sequelize connection 
        sequelize,
        // dont automatically create createAt/updateAt timestamps 
        timestamps: false,
        // don't pluralize name of database table 
        freezeTableName: true,
        //use underscore insteade of camel-casing
        underscore: true,
        // make it so our model name stays lowercase in the database
        modelName: 'user'

    }
);

module.exports = User; 