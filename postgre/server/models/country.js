'use strict';

module.exports = (sequelize, DataTypes) => {
  const country = sequelize.define('country', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  country.associate = (models) => {
    country.hasMany(models.boat, {
      foreignKey: 'countryid',
      as: 'boats',
    });
  };

  return country;
};

// module.exports = (sequelize, DataTypes) => {
//   class country extends Model {
//     /**
//      * Helper method for defining associations.
//      * This method is not a part of Sequelize lifecycle.
//      * The `models/index` file will call this method automatically.
//      */
//     static associate(models) {
//       // define association here
//     }
//   };
//   country.init({
//     name: DataTypes.STRING
//   }, {
//     sequelize,
//     modelName: 'country',
//   });
//   return country;
// };
