const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const BookDetails = sequelize.define('BookDetails',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})

module.exports = BookDetails;