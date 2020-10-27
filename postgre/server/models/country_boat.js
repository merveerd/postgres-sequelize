('use strict');
module.exports = (sequelize, DataTypes) => {
  const country_boat = sequelize.define(
    'country_boat',
    {
      country_id: DataTypes.INTEGER,
      boat_id: DataTypes.INTEGER,
    },
    {}
  );

  country_boat.associate = function (models) {
    country_boat.hasMany(models.country, {
      foreignKey: 'id',
      sourceKey: 'country_id',
    });
    country_boat.hasMany(models.boat, {
      foreignKey: 'id',
      sourceKey: 'boat_id',
    });
  };
  return country_boat;
};
