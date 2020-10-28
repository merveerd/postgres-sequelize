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

  //can be generalized
  update(req, res) {
    return countries
      .findByPk(req.params.id)
      .then((country) => {
        if (!country) {
          return res.status(404).send({
            message: 'Country is not found',
          });
        }

        return country
          .update({
            name: req.body.name.toLowerCase(),
          })
          .then(() => res.status(201).json({ data: country }))
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  },
};
