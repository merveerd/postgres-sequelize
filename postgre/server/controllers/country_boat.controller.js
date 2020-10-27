const countries = require('../models').country;
const boats = require('../models').boat;
const country_boats = require('../models').country_boat;

const Op = require('../models').Sequelize.Op;

//send json
module.exports = {
  create(req, res) {
    return country_boats
      .create({
        country_id: req.body.country_id,
        boat_id: req.body.boat_id,
      })
      .then((result) => res.status(201).send(result))
      .catch((error) => res.status(400).send(error));
  },

  listAll(req, res) {
    return country_boats
      .findAll({
        raw: true,
        attributes: [['boat_id', 'boat id']],
        include: [
          {
            model: countries,
            as: 'countries',
            attributes: [['name', 'name']],
          },
          {
            model: boats,
            as: 'boats',
            attributes: [
              ['name', 'name'],
              ['type', 'type'],
              ['capacity', 'capacity'],
            ],
          },
        ],
      })
      .then((result) => res.status(200).send(result))
      .catch((error) => res.status(400).send(error));
  },

  listByCapacityTypeCountry(req, res) {
    return country_boats
      .findAll({
        raw: true,
        attributes: [['boat_id', 'boat id']],
        include: [
          {
            model: countries,
            where: {
              name: req.params.country.toLowerCase(),
            },
            as: 'countries',
            attributes: [['name', 'name']],
          },
          {
            model: boats,
            where: {
              capacity: {
                [Op.between]: [req.body.minCap, req.body.maxCap],
              },
              type: req.params.type,
            },
            as: 'boats',
            attributes: [
              ['name', 'name'],
              ['type', 'type'],
              ['capacity', 'capacity'],
            ],
          },
        ],
      })
      .then((result) => res.status(200).send(result))
      .catch((error) => res.status(400).send(error));
  },
};
