const crudControllers = require('../utils/crud');
const countries = require('../models').country;

module.exports = {
  ...crudControllers(countries),
  create(req, res) {
    return countries
      .create({
        name: req.body.name.toLowerCase(),
      })
      .then((country) => res.status(201).json({ data: country }))
      .catch((error) => res.status(400).send(error));
  },
};
