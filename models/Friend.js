const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
// const { Address } = require('./Address')

const Friend = sequelize.define('friends', {
  from_user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    // references: {
    //   model: User,
    //   key: 'id'
    // }
  },
  
  to_user_id: {
    type: DataTypes.BIGINT,
    allowNull: false,
    // references: {
    //   model: User,
    //   key: 'id'
    // }
  },

});

User.belongsToMany(User, {
  through: Friend,
  as: 'userFriends',
  foreignKey: 'from_user_id',
  otherKey: 'to_user_id'
});

// Address.belongsToMany(User,{
//   through: UserFriend,
//   as: 'friendsWithAddress',
//   foreignKey: 'from_user_id',
//   otherKey: 'to_user_id'
// })

sequelize.sync({
  // alter: true
}).then(() => {
  console.log('Table synchronized successfully!');
}).catch((error) => {
  console.error('Unable to synchronized table: ', error);
});

module.exports = {
  Friend
};
