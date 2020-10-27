const countries = require('../models').country;
const boats = require('../models').boat;
module.exports = {
  create(req, res) {
    return countries
      .create({
        name: req.body.name,
      })
      .then((country) => res.status(201).send(country))
      .catch((error) => res.status(400).send(error));
  },

  list(req, res) {
    return countries
      .findAll({
        include: [
          {
            model: boats,
            as: 'boats',
          },
        ],
      })
      .then((country) => res.status(200).send(country))
      .catch((error) => res.status(400).send(error));
  },

  retrieve(req, res) {
    console.log(req.params);
    return countries
      .findByPk(req.params.id, {
        include: [
          {
            model: boats,
            as: 'boats',
          },
        ],
      })
      .then((country) => {
        if (!country) {
          return res.status(404).send({
            message: 'Country Not Found',
          });
        }
        return res.status(200).send(country);
      })
      .catch((error) => res.status(400).send(error));
  },
};
