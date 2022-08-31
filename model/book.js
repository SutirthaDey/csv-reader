const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const Book = sequelize.define('book',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },
    title:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    isbn:{
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
        allowNull: false
    }
})

module.exports = Book;