const crudControllers = require('../utils/crud');
const countries = require('../models').country;

module.exports = {
  ...crudControllers(countries),
  create(req, res) {
    return countries
      .findOrCreate({
        where: {
          name: req.body.name.toLowerCase(),
        },
        defaults: {
          name: req.body.name.toLowerCase(),
        },
      })
      .then((result) =>
        res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` })
      )
      .catch((error) => res.status(400).send(error));
  },
};
