const countries = require('../models').country;
const boats = require('../models').boat;
const country_boats = require('../models').country_boat;

const Op = require('../models').Sequelize.Op;
var redis = require('redis');
var client = redis.createClient(6379, 'localhost');

client.on('error', function (err) {
  console.log('Something went wrong ', err);
});

const { cacheRemover, cacheSetter } = require('../utils/helper');

module.exports = {
  create(req, res) {
    return country_boats
      .findOrCreate({
        where: {
          country_id: req.body.country_id,
          boat_id: req.body.boat_id,
        },
        defaults: {
          country_id: req.body.country_id,
          boat_id: req.body.boat_id,
        },
      })
      .then((result) => {
        cacheRemover('all-boats');
        return res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` });
      })
      .catch((error) => res.status(400).send(error));
  },

  delete(req, res) {
    return country_boats
      .findOne({
        where: {
          country_id: req.body.country_id,
          boat_id: req.body.boat_id,
        },
      })
      .then((result) => {
        console.log('result', result);
        result.destroy();

        cacheRemover('all-boats');
        return status(200).json({ message: 'deleted' });
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  },

  listByCapacityTypeCountrywithCache(req, res) {
    client.get(
      `all-boats-${req.params.country}-${req.params.type}-${req.body.minCap}-${req.body.minCap}`,
      function (err, object) {
        if (object) {
          //  console.log('cache data');
          return res.status(200).json({ data: JSON.parse(object) });
        } else {
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
                    ['capacity', 'capacity'],
                    ['type', 'type'],
                  ],
                },
              ],
            })
            .then(function (result) {
              cacheSetter(
                `all-boats-${req.params.country}-${req.params.type}-${req.body.minCap}-${req.body.maxCap}`,
                result
              );

              res.status(200).json({ data: result });
            })
            .catch((error) => res.status(400).send(error));
        }
      }
    );
  },

  listAllByCache(req, res) {
    client.get(`all-boats`, function (err, object) {
      if (object) {
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
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
                  ['capacity', 'capacity'],
                  ['type', 'type'],
                ],
              },
            ],
          })
          .then(function (result) {
            cacheSetter(`all-boats`);

            res.status(200).json({ data: result });
          })
          .catch((error) => res.status(400).send(error));
      }
    });
  },

  listByCountry(req, res) {
    client.get(`${req.params.country}-all-boats`, function (err, object) {
      if (object) {
        //  console.log('cache data');
        return res.status(200).json({ data: JSON.parse(object) });
      } else {
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
                as: 'boats',
                attributes: [
                  ['name', 'name'],
                  ['capacity', 'capacity'],
                  ['type', 'type'],
                ],
              },
            ],
          })
          .then(function (result) {
            cacheSetter(`${req.params.country}-all-boats`, result);

            return res.status(200).json({ data: result });
          })
          .catch((error) => res.status(400).send(error));
      }
    });
  },
};
