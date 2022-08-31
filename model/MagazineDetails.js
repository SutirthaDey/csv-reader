const Sequelize = require('sequelize');
const sequelize = require('../utils/database');

const MagazineDetails = sequelize.define('MagazineDetails',{
    id:{
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    }
})

module.exports = MagazineDetails;