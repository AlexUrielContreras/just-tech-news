const { Model, DataTypes } = require('sequelize');
const sequelize = require('../config/connections');
const bcrypt = require('bcrypt');

// create user model 
class User extends Model {
    checkPassword(loginPw) {
       return bcrypt.compareSync(loginPw, this.password)        
    }
}

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
        // lifecycle event that runs before or after a sequelize call
        hooks: {
           async beforeCreate(newUserData) {
               newUserData.password = await bcrypt.hash(newUserData.password, 10);
               return newUserData
            },
            async beforeUpdate(updatedUserData) {
                updatedUserData.password = await bcrypt.hash(updatedUserData.password, 10);
                return updatedUserData;
            }
        },


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