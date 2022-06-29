// import the Sequelize constructor from the libary 
const Sequelize = require('sequelize');

require('dotenv').config();

// create connection to our database
// grabs the credentials from the .env file
const sequelize = new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PASSWORD, {
    host: 'localhost',
    dialect: 'mysql',
    port: 3306
});


module.exports = sequelize;