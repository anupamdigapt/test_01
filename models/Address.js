const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');

const Address = sequelize.define('addresses', {
    id: {
        type: DataTypes.BIGINT,
        autoIncrement: true,
        primaryKey: true,
        allowNull: false
    },
    userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        // references: {
        //     model: User,
        //     key: 'id'
        // }
    },
    street: {
        type: DataTypes.STRING,
    },
    city: {
        type: DataTypes.STRING,
        allowNull: false
    },
});

Address.belongsTo(User, {
    foreignKey: 'userId',
    as: 'user'
});

sequelize.sync({
    // alter: true
}).then(() => {
    console.log('Table synchronized successfully!');
}).catch((error) => {
    console.error('Unable to synchronized table: ', error);
});

module.exports = {
    Address
};
