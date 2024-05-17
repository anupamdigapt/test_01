const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const { User } = require('./User');
const { Address } = require('./Address')

const UserFriend = sequelize.define('userFriends', {
  userId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },
  
  friendId: {
    type: DataTypes.BIGINT,
    allowNull: false,
    references: {
      model: User,
      key: 'id'
    }
  },

//   addressId: {
//     type: DataTypes.BIGINT,
//     references: {
//         model: Address,
//         key: 'id'
//     }
// },

name: {
  type: DataTypes.STRING,
  allowNull: true
},

});

User.belongsToMany(User, {
  through: UserFriend,
  as: 'friends',
  foreignKey: 'userId',
  otherKey: 'friendId'
});

Address.belongsToMany(User,{
  through: UserFriend,
  as: 'friendsWithAddress',
  foreignKey: 'userId',
  otherKey: 'friendId'
})

sequelize.sync({
  // alter: true
}).then(() => {
  console.log('Table synchronized successfully!');
}).catch((error) => {
  console.error('Unable to synchronized table: ', error);
});

module.exports = {
  UserFriend
};
