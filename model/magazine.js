const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Magazine = sequelize.define('magazines',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.STRING,
        allowNull: false
    },
    isbn:{
        type: Sequelize.STRING,
        allowNull: false
    },
    publishedAt: {
        type: Sequelize.DATEONLY,
        allowNull: false
    }
})

module.exports = Magazine;