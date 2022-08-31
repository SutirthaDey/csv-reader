const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Author = sequelize.define('author',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    email:{
        type: Sequelize.STRING,
        allowNull: false
    },
    firstName: Sequelize.STRING,
    lastName: Sequelize.STRING
})

module.exports = Author;