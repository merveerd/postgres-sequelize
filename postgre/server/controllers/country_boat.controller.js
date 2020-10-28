const countries = require('../models').country;
const boats = require('../models').boat;
const country_boats = require('../models').country_boat;

const Op = require('../models').Sequelize.Op;
const db = require('../models');
var cacher = require('sequelize-redis-cache');
var redis = require('redis');
var rc = redis.createClient(6379, 'localhost');

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
      .then((result) =>
        res
          .status(201)
          .json({ data: result[0], message: `data created ${result[1]}` })
      )
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
        result
          .destroy()
          .then((doc) => {
            status(200).json({ data: doc });
          })
          .catch((err) => {
            res.status(404).json({ message: err });
          });
      })
      .catch((err) => {
        res.status(404).json({ message: err });
      });
  },

  listByCapacityTypeCountrywithCache(req, res) {
    var cacheObj1 = cacher(db.sequelize, rc).model('country_boat').ttl(2);

    return (
      cacheObj1
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
          res.status(200).json({ data: result });
          console.log(cacheObj1.cacheHit); // true or false
        })
        // .then((result) => res.status(200).send(result))
        .catch((error) => res.status(400).send(error))
    );
  },

  listAllByCache(req, res) {
    var cacheObj2 = cacher(db.sequelize, rc).model('country_boat').ttl(2);

    return cacheObj2
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
        res.status(200).json({ data: result });
        console.log(cacheObj2.cacheHit); // true or false
      })
      .catch((error) => res.status(400).send(error));
  },

  listByCountry(req, res) {
    var cacheObj3 = cacher(db.sequelize, rc).model('country_boat').ttl(2);

    return (
      cacheObj3
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
          res.status(200).json({ data: result });
          console.log(cacheObj3.cacheHit); // true or false
        })
        // .then((result) => res.status(200).send(result))
        .catch((error) => res.status(400).send(error))
    );
  },
};
