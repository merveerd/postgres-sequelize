'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class boat extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      this.myAssociation = this.belongsTo(models.country, {
        foreignKey: 'countryid',
      });
    }
  }
  boat.init(
    {
      type: DataTypes.STRING,
      name: DataTypes.STRING,
      capacity: DataTypes.INTEGER,
      countryid: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'boat',
    }
  );
  return boat;
};
